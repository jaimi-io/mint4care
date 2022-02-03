import { Button, Container, Grid, Stack, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import NFTGrid, { GridPropsI } from "../components/NFTGrid";
import VestingStats, { StatsPropsI } from "../components/VestingStats";
import Wallet from "../components/Wallet";
import {
  claimNFT,
  fetchVestingData,
  pauseVesting,
  vestingAddress,
} from "../utils/vestingContractUtils";

const DEFAULT_GRID_PROPS: GridPropsI = {
  vestedNFTs: [],
  claimed: 0,
  released: 0,
};

const UserVesting = (): JSX.Element => {
  const { active, account, library } = useWeb3React();
  const [gridProps, setGridProps] = useState(DEFAULT_GRID_PROPS);
  const [refreshData, setRefreshData] = useState(false);
  const DEFAULT_STATS_PROPS: StatsPropsI = {
    setRefresh: setRefreshData,
  };

  const [statsProps, setStatsProps] = useState(DEFAULT_STATS_PROPS);

  useEffect(() => {
    if (active && account) {
      fetchVestingData(
        library,
        account,
        setGridProps,
        setStatsProps,
        setRefreshData
      );
    }
  }, [active, account, library, refreshData]);

  return (
    <Container>
      <Stack justifyContent="space-between">
        <Typography textAlign="center" variant="h3" p={2}>
          User Vesting
        </Typography>
        <Typography textAlign="center" variant="h6">
          {`(${vestingAddress})`}
        </Typography>
        <Grid container justifyContent="center" p={2}>
          <Wallet />
        </Grid>

        <VestingStats
          paused={statsProps.paused}
          nextRelease={statsProps.nextRelease}
          vestingEnd={statsProps.vestingEnd}
          setRefresh={setRefreshData}
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
            onClick={() => claimNFT(library, setRefreshData)}>
            Claim
          </Button>
          <Button
            variant="contained"
            disabled={!active}
            onClick={() =>
              pauseVesting(library, statsProps.paused ?? false, setRefreshData)
            }>
            {statsProps.paused ? "Unpause" : "Pause"} Vesting
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default UserVesting;
