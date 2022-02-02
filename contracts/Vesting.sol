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
  IERC721 public vestingNFT; // the address of an ERC721 token used for vesting

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

  constructor(address nftAddress) {
    vestingNFT = IERC721(nftAddress);
    vestingStarted = false;
  }

  modifier beforeVestingStarted() {
    require(!vestingStarted, "Vesting has already started!");
    _;
  }

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

  function setUsers(address[] memory account, uint8[][] memory tokenIds)
    external
    onlyOwner
    beforeVestingStarted
  {
    require(account.length == tokenIds.length, "Invalid array lengths!");
    uint256 maxTokens = 0;
    for (uint256 i = 0; i < account.length; i++) {
      userConfig[account[i]] = UserData(tokenIds[i], 0);
      if (tokenIds[i].length > maxTokens) {
        maxTokens = tokenIds[i].length;
      }
    }
    if (maxTokens > maxOwned) {
      maxOwned = maxTokens;
    }
  }

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

    uint256 minVestingTime = releasePeriod * maxOwned;
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

  function claim() external inVestingPeriod {
    UserData memory userData = userConfig[msg.sender];
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

  function endVesting(address reciever) external onlyOwner afterVestingEnded {
    address vestingContract = address(this);
    for (uint256 i = 1; i <= 100; i++) {
      if (vestingNFT.ownerOf(i) == vestingContract) {
        vestingNFT.transferFrom(vestingContract, reciever, i);
      }
    }
  }

  function numNFTsReleased(address user)
    public
    view
    inVestingPeriod
    returns (uint256)
  {
    uint256 vestingStart = vestingStartTime + pausedConfig[user].timeOffset;
    require(
      vestingStart + cliffPeriod < block.timestamp,
      "Not after cliff period!"
    );
    return (block.timestamp - vestingStart) / releasePeriod;
  }
}
