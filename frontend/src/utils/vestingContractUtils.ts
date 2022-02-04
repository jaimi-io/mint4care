import { Web3Provider } from "@ethersproject/providers";
import { BigNumber, ContractTransaction } from "ethers";
import React from "react";
import { GridPropsI } from "../components/NFTGrid";
import { StatsPropsI, VestingStatus } from "../components/VestingStats";
import { Vesting__factory as VestingFactory } from "../typechain";

export const defaultVestingAddress =
  "0xF6DDEF30C610d042dc40e37C961593475E188B6E";
const toMilliseconds = 1000;

const calculateNextRelease = (
  isFull: boolean,
  paused: boolean,
  vestingStart: number,
  releasePeriod: number,
  cliffPeriod: number
) => {
  if (isFull || paused) {
    return 0;
  }
  const currentTime = Date.now() / toMilliseconds;
  const cliffEndTime = vestingStart + cliffPeriod;
  if (currentTime < cliffEndTime) {
    if (releasePeriod > cliffPeriod) {
      return vestingStart + releasePeriod;
    } else {
      return cliffEndTime;
    }
  }
  return (
    currentTime + releasePeriod - ((currentTime - vestingStart) % releasePeriod)
  );
};

export const fetchVestingData = async (
  library: Web3Provider,
  vestingAddress: string,
  userAddress: string,
  setGridProps: React.Dispatch<React.SetStateAction<GridPropsI>>,
  setStatsProps: React.Dispatch<React.SetStateAction<StatsPropsI>>,
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Wait 1s to ensure contract is up to date before querying it
  const TIMEOUT = 1 * toMilliseconds;
  await new Promise((resolve) => setTimeout(resolve, TIMEOUT));
  const vestingContract = VestingFactory.connect(
    vestingAddress,
    library.getSigner()
  );

  const [vestedNFTs, withdrawnCount] = await vestingContract.getUserData(
    userAddress
  );
  let released = BigNumber.from(0);
  let vestingStatus = VestingStatus.NotStarted;
  try {
    released = await vestingContract.numNFTsReleased(userAddress);
  } catch (err: any) {
    if (err.data.message.includes("Not after cliff period!")) {
      vestingStatus = VestingStatus.InCliffPeriod;
    }
    if (
      err.data.message.includes("Not in vesting period!") &&
      (await vestingContract.vestingEndTime())
        .mul(toMilliseconds)
        .lt(Date.now())
    ) {
      vestingStatus = VestingStatus.Ended;
    }
  }
  setGridProps({
    vestedNFTs,
    claimed: withdrawnCount.toNumber(),
    released: released.toNumber(),
  });
  const [pausedTime, timeOffset] = await vestingContract.getPauseData(
    userAddress
  );
  const paused = !pausedTime.eq(0);
  const vestingEnd = (await vestingContract.vestingEndTime()).toNumber();
  const vestingStart = (await vestingContract.vestingStartTime())
    .add(timeOffset)
    .toNumber();
  const releasePeriod = (await vestingContract.releasePeriod()).toNumber();
  const cliffPeriod = (await vestingContract.cliffPeriod()).toNumber();
  const nextRelease = calculateNextRelease(
    released.eq(vestedNFTs.length),
    paused,
    vestingStart,
    releasePeriod,
    cliffPeriod
  );
  if (vestingStatus === VestingStatus.NotStarted) {
    vestingStatus = paused ? VestingStatus.Paused : VestingStatus.InProgress;
  }
  setStatsProps({
    paused,
    vestingStatus,
    nextRelease:
      vestingStatus === VestingStatus.Ended ? 0 : nextRelease * toMilliseconds,
    vestingEnd: vestingEnd * toMilliseconds,
    setRefresh,
  });
};

export const claimNFT = async (
  library: Web3Provider,
  vestingAddress: string,
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
  vestingAddress: string,
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
