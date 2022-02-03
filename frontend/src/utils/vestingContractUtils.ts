import { Web3Provider } from "@ethersproject/providers";
import { GridPropsI } from "../components/NFTGrid";
import { StatsPropsI } from "../components/VestingStats";
import { Vesting__factory as VestingFactory } from "../typechain";

const vestingAddress = "0x9e4097611639016d39E140EB99fF9D620f486E04";

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
