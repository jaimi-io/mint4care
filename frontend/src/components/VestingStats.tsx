import { Stack, Typography } from "@mui/material";
import React from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";
import CustomPaper from "./CustomPaper";

interface StatPropsI {
  title: string;
  children: React.ReactNode;
}

const Stat = ({ title, children }: StatPropsI) => {
  return (
    <CustomPaper>
      <Stack alignItems="center" width={160}>
        <Typography variant="h6">{title}</Typography>
        {children}
      </Stack>
    </CustomPaper>
  );
};

const countdownRender = ({ hours, minutes, seconds }: CountdownRenderProps) => (
  <Typography>
    {hours}h {minutes}m {seconds}s
  </Typography>
);

interface PropsI {
  paused: boolean;
  nextRelease: number;
  vestingEnd: number;
}

const VestingStats = ({
  paused,
  nextRelease,
  vestingEnd,
}: PropsI): JSX.Element => {
  return (
    <Stack direction="row" spacing={2} justifyContent="space-around" p={2}>
      <Stat title="Status">
        <Typography>{paused ? "Paused" : "Unpaused"}</Typography>
      </Stat>
      <Stat title="Next Release">
        <Countdown
          date={nextRelease}
          intervalDelay={0}
          precision={3}
          renderer={countdownRender}
        />
      </Stat>
      <Stat title="Vesting End">
        <Countdown
          date={vestingEnd}
          intervalDelay={0}
          precision={3}
          renderer={countdownRender}
        />
      </Stat>
    </Stack>
  );
};

export default VestingStats;
