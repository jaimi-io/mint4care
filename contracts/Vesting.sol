// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Vesting is Ownable {
  IERC721 public vestingNFT;
  bool public vestingStarted;
  uint256 public vestingEndTime;

  constructor(address nftAddress) {
    vestingNFT = IERC721(nftAddress);
    vestingStarted = false;
  }

  modifier beforeVestingStarted() {
    require(!vestingStarted, "Vesting has already started!");
    _;
  }

  function setUsers(address[] memory account, uint8[][] memory tokenIds)
    external
    onlyOwner
    beforeVestingStarted
  {
    // TO IMPLEMENT
  }

  function setUser(address account, uint8[] memory tokenIds)
    external
    onlyOwner
    beforeVestingStarted
  {
    // TO IMPLEMENT
  }

  function startVesting(
    uint256 timestamp,
    uint256 cliffPeriod,
    uint256 releasePeriod,
    uint256 securityPeriod
  ) external onlyOwner beforeVestingStarted {
    // TO IMPLEMENT
  }

  modifier afterVestingStarted() {
    require(vestingStarted, "Vesting has not started!");
    _;
  }

  modifier beforeVestingEnded() {
    require(block.timestamp < vestingEndTime, "Vesting has ended!");
    _;
  }

  function claim() external afterVestingStarted beforeVestingEnded {
    // TO IMPLEMENT
  }

  function pauseVesting() external afterVestingStarted beforeVestingEnded {
    // TO IMPLEMENT
  }

  function unpauseVesting() external afterVestingStarted beforeVestingEnded {
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
