import { Box, Grid, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import CustomPaper from "./CustomPaper";
import NFTItem from "./NFTItem";
import VestingKey from "./VestingKey";

export interface GridPropsI {
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

const minHeight = {
  minHeight: "50px",
};

export interface TokenI {
  id: number;
  status: TokenStatus;
}

const NFTGrid = ({
  vestedNFTs,
  claimed,
  released,
}: GridPropsI): JSX.Element => {
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
    <CustomPaper sx={minHeight}>
      {tokens.length === 0 ? (
        <Skeleton variant="rectangular" height="50px" />
      ) : (
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={2}>
            <VestingKey colorKeys={colorKeys} />
          </Grid>
          <Grid item xs={10}>
            <Box gap={2} display="flex" flexWrap="wrap" justifyContent="center">
              {tokens.map((token, index) => (
                <NFTItem key={index} token={token} />
              ))}
            </Box>
          </Grid>
        </Grid>
      )}
    </CustomPaper>
  );
};

export default NFTGrid;
