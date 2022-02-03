import { Box, Paper, Grid, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import NFTItem from "./NFTItem";
import VestingKey from "./VestingKey";

interface PropsI {
  vestedNFTs: number[];
  claimed: number;
  released: number;
}

enum TokenStatus {
  vesting = "inherit",
  claimed = "success",
  claimable = "info",
}

const colorKeys = [
  { color: "#E0E0E0", title: "Vesting" },
  { color: "success.main", title: "Claimed" },
  { color: "info.main", title: "Claimable" },
];

const paperStyle = {
  borderRadius: "10px",
  padding: "10px",
  minHeight: "50px",
};

export interface TokenI {
  id: number;
  status: TokenStatus;
}

const NFTGrid = ({ vestedNFTs, claimed, released }: PropsI): JSX.Element => {
  const [tokens, setTokens] = useState<TokenI[]>([]);

  useEffect(() => {
    const updatedTokens = vestedNFTs.map((id, index) => {
      let status: TokenStatus = TokenStatus.vesting;
      if (index < claimed) {
        status = TokenStatus.claimed;
      } else if (index < released) {
        status = TokenStatus.claimable;
      }
      return { id, status };
    });
    setTokens(updatedTokens);
  }, [claimed, released, vestedNFTs]);

  return (
    <Grid container spacing={2} p={2}>
      <Grid item xs={8}>
        <Paper sx={paperStyle}>
          {tokens.length === 0 ? (
            <Skeleton variant="rectangular" height="50px" />
          ) : (
            <Box gap={2} display="flex" flexWrap="wrap" justifyContent="center">
              {tokens.map((token, index) => (
                <NFTItem key={index} token={token} />
              ))}
            </Box>
          )}
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper variant="outlined" sx={paperStyle}>
          <VestingKey colorKeys={colorKeys} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default NFTGrid;
