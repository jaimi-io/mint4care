import { Web3Provider } from "@ethersproject/providers";
import { ContractTransaction } from "ethers";
import React from "react";
import { GridPropsI } from "../components/NFTGrid";
import { StatsPropsI } from "../components/VestingStats";
import { Vesting__factory as VestingFactory } from "../typechain";

export const vestingAddress = "0x0716985f5DB8fB55715CDccAA63E7719A4CC636C";
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
  const [size, vestedNFTs, withdrawnCount] = await vestingContract.getUserData(
    userAddress
  );
  const released = await vestingContract.numNFTsReleased(userAddress);
  let bitMap = vestedNFTs;
  let i = 0;
  const nftsArray: number[] = [];
  while (bitMap !== 0) {
    if ((bitMap & 1) === 1) {
      nftsArray.push(i);
    }
    i += 1;
    bitMap >>= 1;
  }
  setGridProps({
    vestedNFTs: nftsArray,
    claimed: withdrawnCount,
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
    released.eq(size),
    paused,
    vestingStart,
    releasePeriod,
    cliffPeriod
  );
  setStatsProps({
    paused,
    nextRelease: nextRelease * toMilliseconds,
    vestingEnd: vestingEnd * toMilliseconds,
    setRefresh,
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
