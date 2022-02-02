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

  // holds user vesting data
  mapping(address => UserData) private userConfig;

  struct UserData {
    uint8[] vestedNFTs; // token IDs assigned to user
    uint256 withdrawnCount; // number of tokens withdrawn from vesting
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
  }

  function setUsers(address[] memory account, uint8[][] memory tokenIds)
    external
    onlyOwner
    beforeVestingStarted
  {
    require(account.length == tokenIds.length, "Invalid array lengths!");
    for (uint256 i = 0; i < account.length; i++) {
      userConfig[account[i]] = UserData(tokenIds[i], 0);
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

    // TODO: add releasePeriod * maxOwned to vestingEndTime
    vestingEndTime = vestingStartTime + securityPeriod;
    vestingStarted = true;
  }

  modifier afterVestingStarted() {
    require(vestingStarted, "Vesting has not started!");
    _;
  }

  modifier inVestingPeriod() {
    require(
      block.timestamp >= vestingStartTime && block.timestamp < vestingEndTime,
      "Vesting has ended!"
    );
    _;
  }

  function claim() external afterVestingStarted inVestingPeriod {
    // TO IMPLEMENT
  }

  function pauseVesting() external afterVestingStarted inVestingPeriod {
    // TO IMPLEMENT
  }

  function unpauseVesting() external afterVestingStarted inVestingPeriod {
    // TO IMPLEMENT
  }

  modifier afterVestingEnded() {
    require(block.timestamp >= vestingEndTime, "Vesting has not ended!");
    _;
  }

  function endVesting(address reciever) external onlyOwner afterVestingEnded {
    // TO IMPLEMENT
  }
}
