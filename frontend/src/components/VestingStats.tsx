import { Skeleton, Stack, Typography } from "@mui/material";
import React from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";
import CustomPaper from "./CustomPaper";

interface StatPropsI {
  title: string;
  attribute: number | boolean | undefined;
  children: React.ReactNode;
}

const Stat = ({ title, children, attribute }: StatPropsI) => {
  return (
    <CustomPaper>
      <Stack alignItems="center" width={160}>
        <Typography variant="h6">{title}</Typography>
        {attribute !== void 0 ? (
          children
        ) : (
          <Skeleton height="30px" width="100%" />
        )}
      </Stack>
    </CustomPaper>
  );
};

const countdownRender = ({ hours, minutes, seconds }: CountdownRenderProps) => (
  <Typography>
    {hours}h {minutes}m {seconds}s
  </Typography>
);

export interface StatsPropsI {
  paused?: boolean;
  nextRelease?: number;
  vestingEnd?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const VestingStats = ({
  paused,
  nextRelease,
  vestingEnd,
  setRefresh,
}: StatsPropsI): JSX.Element => {
  return (
    <Stack direction="row" spacing={2} justifyContent="space-between" p={2}>
      <Stat title="Vesting Status" attribute={paused}>
        <Typography color={paused ? "error.main" : "success.main"}>
          {paused ? "Paused" : "Running"}
        </Typography>
      </Stat>
      <Stat title="Next Release" attribute={nextRelease}>
        <Countdown
          date={nextRelease}
          key={nextRelease}
          renderer={countdownRender}
          onComplete={() => setRefresh((prev) => !prev)}
        />
      </Stat>
      <Stat title="Vesting End" attribute={vestingEnd}>
        <Countdown
          date={vestingEnd}
          key={vestingEnd}
          renderer={countdownRender}
          onComplete={() => setRefresh((prev) => !prev)}
        />
      </Stat>
    </Stack>
  );
};

export default VestingStats;
