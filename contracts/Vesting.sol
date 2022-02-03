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

  uint256 private maxOwned; // maximum number of NFTs that is owned by a single address

  // holds user vesting data
  mapping(address => UserData) private userConfig;
  // holds user vesting paused data
  mapping(address => PausedData) private pausedConfig;

  struct UserData {
    uint8[] vestedNFTs; // token IDs assigned to user
    uint256 withdrawnCount; // number of tokens withdrawn from vesting
  }

  struct PausedData {
    uint256 pausedTime; // timestamp when the user paused the vesting procedure (0 if not paused)
    uint256 timeOffset; // time offset in seconds due to pausings
  }

  /**
   * @param nftAddress - address of an ERC721 token used for vesting
   */
  constructor(address nftAddress) {
    vestingNFT = IERC721(nftAddress);
  }

  modifier beforeVestingStarted() {
    require(!vestingStarted, "Vesting has already started!");
    _;
  }

  /**
   * @notice Sets the vesting parameters for a user. Can only be set before vesting started.
   * @param account - address of the user to set the vesting parameters for
   * @param tokenIds - NFT token IDs to be assigned to the user
   */
  function setUser(address account, uint8[] memory tokenIds)
    external
    onlyOwner
    beforeVestingStarted
  {
    userConfig[account] = UserData(tokenIds, 0);
    uint256 maxTokens = tokenIds.length;
    if (maxTokens > maxOwned) {
      maxOwned = maxTokens;
    }
  }

  /**
   * @notice Sets the vesting parameters for multiple users. Can only be set before vesting started.
   * @param accounts - addresses of the users to set the vesting parameters for
   * @param tokenIds - NFT token IDs to be assigned to each user
   */
  function setUsers(address[] memory accounts, uint8[][] memory tokenIds)
    external
    onlyOwner
    beforeVestingStarted
  {
    require(accounts.length == tokenIds.length, "Invalid array lengths!");
    uint256 maxTokens;
    for (uint256 i = 0; i < accounts.length; i++) {
      userConfig[accounts[i]] = UserData(tokenIds[i], 0);
      if (tokenIds[i].length > maxTokens) {
        maxTokens = tokenIds[i].length;
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
  }

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
    require(userData.vestedNFTs.length > 0, "No NFTs to claim!");
    require(
      userData.withdrawnCount != userData.vestedNFTs.length,
      "No NFTs left to claim!"
    );
    uint256 nftsReleased = numNFTsReleased(msg.sender);
    require(
      nftsReleased > userData.withdrawnCount,
      "Wait for remaining NFTs to release!"
    );
    address vestingContract = address(this);
    for (uint256 i = userData.withdrawnCount; i < nftsReleased; i++) {
      vestingNFT.transferFrom(
        vestingContract,
        msg.sender,
        userData.vestedNFTs[i]
      );
    }
    userConfig[msg.sender].withdrawnCount = nftsReleased;
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

  modifier afterVestingEnded() {
    require(block.timestamp >= vestingEndTime, "Vesting has not ended!");
    _;
  }

  /**
   * @notice Ends vesting by returning remaining NFTs to reciever.
   * Only callable by owner and if vesting has ended.
   * @param reciever - address to return NFTs to
   */
  function endVesting(address reciever) external onlyOwner afterVestingEnded {
    address vestingContract = address(this);
    for (uint256 i = 1; i <= 100; i++) {
      if (vestingNFT.ownerOf(i) == vestingContract) {
        vestingNFT.transferFrom(vestingContract, reciever, i);
      }
    }
  }

  /**
   * @notice Returns the vesting time statistics for a user.
   * @param user - address of the user
   * @return bool - true if user has paused vesting
   * @return uint256 - time of next release
   * @return uint256 - time of vesting end
   */
  function getVestingStats(address user)
    external
    view
    inVestingPeriod
    returns (
      bool,
      uint256,
      uint256
    )
  {
    uint256 pausedTime = pausedConfig[user].pausedTime;
    bool isPaused = pausedTime != 0;
    if (isPaused) {
      return (isPaused, 0, vestingEndTime);
    }
    uint256 vestingStartTime_ = vestingStartTime +
      pausedConfig[user].timeOffset;
    uint256 releasePeriod_ = releasePeriod;
    uint256 cliffTime = vestingStartTime_ + cliffPeriod;
    if (block.timestamp < cliffTime) {
      if (releasePeriod_ > cliffPeriod) {
        uint256 releaseTime = vestingStartTime_ + releasePeriod_;
        return (isPaused, releaseTime, vestingEndTime);
      } else {
        return (isPaused, cliffTime, vestingEndTime);
      }
    }
    uint256 nextReleaseTime = block.timestamp +
      releasePeriod_ -
      ((block.timestamp - vestingStartTime_) % releasePeriod_);
    return (isPaused, nextReleaseTime, vestingEndTime);
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
    uint256 maxNFTs = userConfig[user].vestedNFTs.length;
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
}
