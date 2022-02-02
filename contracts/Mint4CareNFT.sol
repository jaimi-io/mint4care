// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 *  @title NFT contract
 ***********************************
 *  @notice Lets owner mint 100 (ids 1-100) NFTs in one transaction
 */
contract Mint4CareNFT is ERC721, Ownable {
  string private _baseURIString; // URI prefix for metadata tokenURI

  /**
   * @param name - NFT collection name
   * @param symbol - NFT collection symbol
   * @param baseURI - metadata URI for the NFT collection
   */
  constructor(string memory name, string memory symbol, string memory baseURI) ERC721(name, symbol) {
    _baseURIString = baseURI;
  }

  /**
   * @notice mints 100 of NFTs to the vesting contract
   * @param vestingContract - the vesting contract address to mint to
   */
  function mint(address vestingContract) external onlyOwner {
    uint256 limit = 100;
    for (uint256 i = 1; i <= limit; i++) {
      _mint(vestingContract, i);
    }
  }

  /**
   * @return The baseURI for the NFT collection
   */
  function _baseURI() internal view virtual override returns (string memory) {
    return _baseURIString;
  }
}
