import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { Mint4CareNFT } from "../typechain";

chai.use(solidity);

const collectionName = "mint4CareNFT";
const symbol = "M4C";
const baseURI = "https://mint4care.com/";

describe("Mint4CareNFT", () => {
  let nftContract: Mint4CareNFT;
  let owner: SignerWithAddress | undefined;
  let signer: SignerWithAddress | undefined;
  let mockVestingContract: SignerWithAddress | undefined;
  let mockVestingContractAddress: string;

  before(async () => {
    const NFTContract = await ethers.getContractFactory("Mint4CareNFT");
    nftContract = await NFTContract.deploy(collectionName, symbol, baseURI);
    await nftContract.deployed();

    [owner, signer, mockVestingContract] = await ethers.getSigners();
    mockVestingContractAddress = mockVestingContract
      ? await mockVestingContract.getAddress()
      : "";
  });

  describe("Constructor", () => {
    it("Should set name correctly", async () => {
      expect(await nftContract.name()).to.equal(collectionName);
    });

    it("Should set symbol correctly", async () => {
      expect(await nftContract.symbol()).to.equal(symbol);
    });
  });

  describe("Mint 100", () => {
    it("Should not mint if not owner", async () => {
      expect(
        nftContract.connect(signer || "").mint(mockVestingContractAddress)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should mint 100 to mockVestingContract", async () => {
      expect(await nftContract.balanceOf(mockVestingContractAddress)).to.equal(
        0
      );
      await nftContract.mint(mockVestingContractAddress);
      expect(await nftContract.balanceOf(mockVestingContractAddress)).to.equal(
        100
      );
    });
  });
});
