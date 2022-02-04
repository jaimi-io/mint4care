import { Button, Container, Grid, Stack, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import NFTGrid, { GridPropsI } from "../components/NFTGrid";
import VestingStats, {
  StatsPropsI,
  VestingStatus,
} from "../components/VestingStats";
import Wallet from "../components/Wallet";
import {
  claimNFT,
  defaultVestingAddress,
  fetchVestingData,
  pauseVesting,
} from "../utils/vestingContractUtils";
import EditableAddress from "../components/EditableAddress";

const DEFAULT_GRID_PROPS: GridPropsI = {
  vestedNFTs: [],
  claimed: 0,
  released: 0,
};

const UserVesting = (): JSX.Element => {
  const { active, account, library } = useWeb3React();
  const [gridProps, setGridProps] = useState(DEFAULT_GRID_PROPS);
  const [vestingAddress, setVestingAddress] = useState(defaultVestingAddress);
  const [refreshData, setRefreshData] = useState(false);
  const DEFAULT_STATS_PROPS: StatsPropsI = {
    setRefresh: setRefreshData,
    vestingStatus: VestingStatus.NotStarted,
  };

  const [statsProps, setStatsProps] = useState(DEFAULT_STATS_PROPS);

  useEffect(() => {
    if (active && account) {
      fetchVestingData(
        library,
        vestingAddress,
        account,
        setGridProps,
        setStatsProps,
        setRefreshData
      );
    }
  }, [active, account, library, refreshData, vestingAddress]);

  return (
    <Container>
      <Stack justifyContent="space-between">
        <Grid container alignItems="center">
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <Typography textAlign="center" variant="h3" p={2}>
              Vesting Dashboard
            </Typography>
          </Grid>
          <Grid container item xs={3} justifyContent="flex-end">
            <Wallet />
          </Grid>
        </Grid>

        <EditableAddress
          vestingAddress={vestingAddress}
          setVestingAddress={setVestingAddress}
          setRefreshData={setRefreshData}
        />

        <VestingStats
          nextRelease={statsProps.nextRelease}
          vestingEnd={statsProps.vestingEnd}
          setRefresh={setRefreshData}
          vestingStatus={statsProps.vestingStatus}
        />
        <NFTGrid
          vestedNFTs={gridProps.vestedNFTs}
          claimed={gridProps.claimed}
          released={gridProps.released}
        />

        <Stack direction="row" spacing={2} justifyContent="center" p={2}>
          <Button
            variant="contained"
            disabled={!active || gridProps.released <= gridProps.claimed}
            onClick={() => claimNFT(library, vestingAddress, setRefreshData)}>
            Claim
          </Button>
          <Button
            variant="contained"
            disabled={!active}
            onClick={() =>
              pauseVesting(
                library,
                vestingAddress,
                statsProps.paused ?? false,
                setRefreshData
              )
            }>
            {statsProps.paused ? "Unpause" : "Pause"} Vesting
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default UserVesting;
