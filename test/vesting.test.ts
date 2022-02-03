import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { Vesting, Mint4CareNFT } from "../typechain";

chai.use(solidity);

describe("Vesting contract", () => {
  let vestingContract: Vesting;
  let nftContract: Mint4CareNFT;
  let owner: SignerWithAddress | undefined;
  let user1: SignerWithAddress | undefined;
  let user2: SignerWithAddress | undefined;

  before(async () => {
    const NFTContract = await ethers.getContractFactory("Mint4CareNFT");
    nftContract = await NFTContract.deploy(
      "mint4CareNFT",
      "M4C",
      "https://mint4care.com/"
    );
    await nftContract.deployed();

    const VestingContract = await ethers.getContractFactory("Vesting");
    vestingContract = await VestingContract.deploy(nftContract.address);
    await vestingContract.deployed();

    [owner, user1, user2] = await ethers.getSigners();
  });

  describe("Constructor", () => {
    it("Should set nft contract correctly", async () => {
      expect(await vestingContract.vestingNFT()).to.equal(nftContract.address);
    });

    it("Should set vestingStarted to false", async () => {
      expect(await vestingContract.vestingStarted()).to.equal(false);
    });
  });

  describe("Set Users", () => {
    it("Should not set user if not owner", async () => {
      expect(
        vestingContract.connect(user1 || "").setUser(user1!.address, [])
      ).to.be.revertedWith("Ownable: caller is not the owner");
      expect(
        vestingContract
          .connect(user1 || "")
          .setUsers([user1!.address, user2!.address], [[]])
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should set user", async () => {
      const tokenIds = [1, 6, 35, 64, 89];
      await vestingContract.setUser(user1!.address, tokenIds);
      const userData: [number[], BigNumber] = await vestingContract.getUserData(
        user1!.address
      );
      expect(userData[0]).to.deep.equal(tokenIds);
      expect(userData[1]).to.equal(BigNumber.from(0));
    });

    it("Should fail to set users with invalid params", async () => {
      const tokenIds = [1, 6, 35, 64, 89];
      expect(
        vestingContract.setUsers([user1!.address, user2!.address], [tokenIds])
      ).to.be.revertedWith("Invalid array lengths!");
    });

    it("Should set users", async () => {
      const tokenIds1 = [1, 6, 35, 64, 89];
      const tokenIds2 = [5, 8, 43, 67, 99];
      const withdrawnCount = BigNumber.from(0);
      await vestingContract.setUsers(
        [user1!.address, user2!.address],
        [tokenIds1, tokenIds2]
      );

      const userData1: [number[], BigNumber] =
        await vestingContract.getUserData(user1!.address);
      expect(userData1[0]).to.deep.equal(tokenIds1);
      expect(userData1[1]).to.equal(withdrawnCount);

      const userData2: [number[], BigNumber] =
        await vestingContract.getUserData(user2!.address);
      expect(userData2[0]).to.deep.equal(tokenIds2);
      expect(userData2[1]).to.equal(withdrawnCount);
    });
  });
});
