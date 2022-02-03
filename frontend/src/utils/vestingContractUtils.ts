import { Web3Provider } from "@ethersproject/providers";
import { ContractTransaction } from "ethers";
import React from "react";
import { GridPropsI } from "../components/NFTGrid";
import { StatsPropsI } from "../components/VestingStats";
import { Vesting__factory as VestingFactory } from "../typechain";

const vestingAddress = "0x6f5aFe8BCd4dD3e2E634a00c0850f077Ac8BbC83";

export const fetchVestingData = async (
  library: Web3Provider,
  userAddress: string,
  setGridProps: React.Dispatch<React.SetStateAction<GridPropsI>>,
  setStatsProps: React.Dispatch<React.SetStateAction<StatsPropsI>>
) => {
  const vestingContract = VestingFactory.connect(
    vestingAddress,
    library.getSigner()
  );
  const [vestedNFTs, withdrawnCount] = await vestingContract.getUserData(
    userAddress
  );
  const released = await vestingContract.numNFTsReleased(userAddress);
  setGridProps({
    vestedNFTs,
    claimed: withdrawnCount.toNumber(),
    released: released.toNumber(),
  });
  const [paused, nextRelease, vestingEnd] =
    await vestingContract.getVestingStats(userAddress);
  console.log(nextRelease, vestingEnd);
  setStatsProps({
    paused,
    nextRelease: nextRelease.toNumber() * 1000,
    vestingEnd: vestingEnd.toNumber() * 1000,
  });
};

export const claimNFT = async (
  library: Web3Provider,
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const vestingContract = VestingFactory.connect(
    vestingAddress,
    library.getSigner()
  );
  try {
    const tx = await vestingContract.claim();
    await tx.wait();
    setRefresh((prev) => !prev);
  } catch (error) {
    console.error(error);
  }
};

export const pauseVesting = async (
  library: Web3Provider,
  isPaused: boolean,
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const vestingContract = VestingFactory.connect(
    vestingAddress,
    library.getSigner()
  );
  let tx: ContractTransaction;
  try {
    if (isPaused) {
      tx = await vestingContract.unpauseVesting();
    } else {
      tx = await vestingContract.pauseVesting();
    }
    await tx.wait();
    setRefresh((prev) => !prev);
  } catch (error) {
    console.error(error);
  }
};
