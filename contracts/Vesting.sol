// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Vesting is Ownable {
  bool public vestingStarted; // true when the vesting procedure has started
  uint256 public vestingStartTime; // timestamp when the vesting procedure started
  uint256 public cliffPeriod; // cliff period in seconds
  uint256 public releasePeriod; // time in seconds for one NFT to be released
  uint256 public vestingEndTime; // timestamp when the vesting procedure ends
  IERC721 public immutable vestingNFT; // the address of an ERC721 token used for vesting
  uint256 public boughtNFTs;

  uint256 private maxOwned; // maximum number of NFTs that is owned by a single address

  // holds user vesting data
  mapping(address => UserData) private userConfig;
  // holds user vesting paused data
  mapping(address => PausedData) private pausedConfig;

  struct UserData {
    uint8 size; // total number of NFTs vested
    uint8 bitShift;
    uint8 withdrawnCount; // number of tokens withdrawn from vesting
    uint128 vestedNFTs; // bitmap of token IDs assigned to user
  }

  struct PausedData {
    uint256 pausedTime; // timestamp when the user paused the vesting procedure (0 if not paused)
    uint256 timeOffset; // time offset in seconds due to pausings
  }

  event UserDataSet(address user, uint256 vestedNFTs);
  event VestingStarted();
  event NFTsClaimed(address user, uint8[] tokenIds);
  event NFTsReclaimed(address admin, address receiver, uint8[] tokenIds);

  /**
   * @param nftAddress - address of an ERC721 token used for vesting
   */
  constructor(address nftAddress) {
    vestingNFT = IERC721(nftAddress);
  }

  /******************************
   *        PRE-VESTING         *
   ******************************/

  modifier beforeVestingStarted() {
    require(!vestingStarted, "Vesting has already started!");
    _;
  }

  /**
   * @notice Sets the vesting parameters for a user. Can only be set before vesting started.
   * @param account - address of the user to set the vesting parameters for
   * @param vestedNFTs - bitmap of NFT token IDs to be assigned to the user
   */
  function setUser(address account, uint128 vestedNFTs)
    external
    onlyOwner
    beforeVestingStarted
  {
    uint256 size = _setUser(account, vestedNFTs);
    if (size > maxOwned) {
      maxOwned = size;
    }
  }

  /**
   * @notice Sets the vesting parameters for multiple users. Can only be set before vesting started.
   * @param accounts - addresses of the users to set the vesting parameters for
   * @param vestedNFTs - array of bitmaps of NFT token IDs to be assigned to each user
   */
  function setUsers(address[] memory accounts, uint128[] memory vestedNFTs)
    external
    onlyOwner
    beforeVestingStarted
  {
    require(accounts.length == vestedNFTs.length, "Invalid array lengths!");
    uint256 maxTokens;
    for (uint256 i = 0; i < accounts.length; i++) {
      uint256 size = _setUser(accounts[i], vestedNFTs[i]);
      if (size > maxTokens) {
        maxTokens = size;
      }
    }
    if (maxTokens > maxOwned) {
      maxOwned = maxTokens;
    }
  }

  /**
   * @notice Starts the vesting procedure.
   * @param timestamp - vesting start time, if 0 start this block
   * @param cliffPeriod_ - cliff period in seconds
   * @param releasePeriod_ - time in seconds for one NFT to be released
   * @param securityPeriod - time in seconds for claims to be valid before vesting closes
   */
  function startVesting(
    uint256 timestamp,
    uint256 cliffPeriod_,
    uint256 releasePeriod_,
    uint256 securityPeriod
  ) external onlyOwner beforeVestingStarted {
    require(
      vestingNFT.balanceOf(address(this)) == 100,
      "NFT collection must be minted to vesting contract!"
    );
    require(
      timestamp == 0 || timestamp > block.timestamp,
      "Invalid timestamp!"
    );

    cliffPeriod = cliffPeriod_;
    releasePeriod = releasePeriod_;
    vestingStartTime = timestamp == 0 ? block.timestamp : timestamp;

    uint256 minVestingTime = releasePeriod_ * maxOwned;
    vestingEndTime = vestingStartTime + minVestingTime + securityPeriod;
    vestingStarted = true;
    emit VestingStarted();
  }

  /******************************
   *       DURING-VESTING       *
   ******************************/

  modifier inVestingPeriod() {
    require(
      block.timestamp >= vestingStartTime && block.timestamp < vestingEndTime,
      "Not in vesting period!"
    );
    _;
  }

  /**
   * @notice Claims released NFTs from the vesting contract for a given user.
   * Reverts if not in vestingPeriod, user has not vested NFTs or if all available NFTs
   * have already been claimed by the user.
   */
  function claim() external inVestingPeriod {
    UserData memory userData = getUserData(msg.sender);
    require(userData.size > 0, "No NFTs to claim!");
    require(userData.withdrawnCount != userData.size, "No NFTs left to claim!");
    uint256 nftsReleased = numNFTsReleased(msg.sender);
    require(
      nftsReleased > userData.withdrawnCount,
      "Wait for remaining NFTs to release!"
    );
    address vestingContract = address(this);
    uint8 bitShift = userData.bitShift;
    uint8 i = userData.withdrawnCount;
    uint128 bitMap = userData.vestedNFTs >> bitShift;
    uint8[] memory claimedNFTs = new uint8[](nftsReleased - i);
    uint256 j;
    while (i < nftsReleased) {
      if ((bitMap & 1) == 1) {
        vestingNFT.transferFrom(vestingContract, msg.sender, bitShift + 1);
        claimedNFTs[j] = bitShift + 1;
        j += 1;
        i += 1;
      }
      bitShift += 1;
      bitMap >>= 1;
    }
    userConfig[msg.sender].withdrawnCount = i;
    userConfig[msg.sender].bitShift = bitShift;
    emit NFTsClaimed(msg.sender, claimedNFTs);
  }

  modifier whenNotPaused() {
    require(
      pausedConfig[msg.sender].pausedTime == 0,
      "Vesting is paused for user!"
    );
    _;
  }

  /**
   * @notice Pauses the vesting procedure for a user.
   * User is able to claim NFTs released before pause time. To claim remaining NFTs,
   * user must unpause the vesting procedure. Only callable if currently unpaused and in
   * vesting period.
   */
  function pauseVesting() external inVestingPeriod whenNotPaused {
    pausedConfig[msg.sender].pausedTime = block.timestamp;
  }

  modifier whenPaused() {
    require(
      pausedConfig[msg.sender].pausedTime != 0,
      "Vesting is not paused for user!"
    );
    _;
  }

  /**
   * @notice Resumes the vesting procedure for a user.
   * Only callable if user vesting currently paused and in vesting period.
   */
  function unpauseVesting() external inVestingPeriod whenPaused {
    PausedData storage pausedData = pausedConfig[msg.sender];
    if (block.timestamp > pausedData.pausedTime) {
      pausedData.timeOffset += block.timestamp - pausedData.pausedTime;
    }
    pausedData.pausedTime = 0;
  }

  /******************************
   *        POST-VESTING        *
   ******************************/

  modifier afterVestingEnded() {
    require(block.timestamp >= vestingEndTime, "Vesting has not ended!");
    _;
  }

  /**
   * @notice Ends vesting by returning remaining NFTs to reciever.
   * Only callable by owner and if vesting has ended.
   * @param receiver - address to return NFTs to
   */
  function endVesting(address receiver) external onlyOwner afterVestingEnded {
    address vestingContract = address(this);
    uint8[] memory reclaimed = new uint8[](vestingNFT.balanceOf(msg.sender));
    uint256 j;
    for (uint8 i = 1; i <= 100; i++) {
      if (vestingNFT.ownerOf(i) == vestingContract) {
        vestingNFT.transferFrom(vestingContract, receiver, i);
        reclaimed[j] = i;
        j += 1;
      }
    }
    emit NFTsReclaimed(msg.sender, receiver, reclaimed);
  }

  /******************************
   *          HELPERS           *
   ******************************/

  /**
   * @notice Returns the paused data for a user.
   * @param user - address of the user
   * @return PauseData memory - pause vesting data
   */
  function getPauseData(address user)
    external
    view
    returns (PausedData memory)
  {
    return pausedConfig[user];
  }

  /**
   * @notice Returns the time for 1 NFT to be released in seconds
   * @param numNFTs - number of NFTs to release
   * @param numDays - number of days for release
   * @return uint256 - release period in seconds
   */
  function calculateReleasePeriod(uint256 numNFTs, uint256 numDays)
    external
    pure
    returns (uint256)
  {
    require(numNFTs > 0 && numDays > 0, "Release params must be 1 or more!");
    return (numDays * 86400) / numNFTs;
  }

  /**
   * @notice Returns the number of NFTs released to a user at current time.
   * If paused at current time, returns number of NFTs released to user at time of pause.
   * @param user - address of the user
   * @return uint256 - number of NFTs available to the user (includes previous withdrawls)
   */
  function numNFTsReleased(address user)
    public
    view
    inVestingPeriod
    returns (uint256)
  {
    PausedData memory pausedData = pausedConfig[user];
    uint256 vestingStart = vestingStartTime + pausedData.timeOffset;
    uint256 currentTime = pausedData.pausedTime != 0
      ? pausedData.pausedTime
      : block.timestamp;

    require(
      vestingStart + cliffPeriod < currentTime,
      "Not after cliff period!"
    );
    uint256 maxNFTs = userConfig[user].size;
    uint256 numReleased = (currentTime - vestingStart) / releasePeriod;
    if (maxNFTs < numReleased) {
      return maxNFTs;
    }
    return numReleased;
  }

  /**
   * @notice Returns the vesting data for a user.
   * @param user - address of the user
   * @return UserData memory - user vesting data
   */
  function getUserData(address user) public view returns (UserData memory) {
    return userConfig[user];
  }

  /**
   * @notice Sets the vesting parameters for a user. Ensures no user shares the same tokenId
   * @param account - address of the user to set the vesting parameters for
   * @param vestedNFTs - bitmap of NFT token IDs to be assigned to the user
   * @return uint8 - number of vested tokens
   */
  function _setUser(address account, uint128 vestedNFTs)
    internal
    returns (uint8)
  {
    require(
      vestedNFTs & boughtNFTs == 0,
      "No duplicate NFT ownership allowed!"
    );
    uint8 size;
    uint128 bitMap = vestedNFTs;
    uint8 bitShift;
    uint8 i;
    while (bitMap != 0) {
      if ((bitMap & 1) == 1) {
        if (bitShift == 0) {
          bitShift = i;
        }
        size += 1;
      }
      i += 1;
      bitMap >>= 1;
    }
    userConfig[account] = UserData(size, bitShift, 0, vestedNFTs);
    boughtNFTs |= vestedNFTs;
    return size;
  }
}
