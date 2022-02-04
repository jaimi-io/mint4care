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

const countdownRender = ({
  days,
  hours,
  minutes,
  seconds,
}: CountdownRenderProps) => {
  let text = "";
  if (days > 0) {
    text += `${days}d `;
  }
  if (hours > 0) {
    text += `${hours}h `;
  }
  if (minutes > 0) {
    text += `${minutes}m `;
  }
  if (seconds > 0) {
    text += `${seconds}s`;
  }
  return <Typography>{text}</Typography>;
};

export enum VestingStatus {
  NotStarted = "Not Started",
  InCliffPeriod = "In Cliff Period",
  InProgress = "In Progress",
  Paused = "Paused",
  Ended = "Ended",
}

const getVestingStatusColor = (vestingStatus: VestingStatus) => {
  if (vestingStatus === VestingStatus.InProgress) {
    return "success.main";
  }
  if (vestingStatus === VestingStatus.Paused) {
    return "error.main";
  }
  return "text.main";
};

export interface StatsPropsI {
  paused?: boolean;
  vestingStatus: VestingStatus;
  nextRelease?: number;
  vestingEnd?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const VestingStats = ({
  vestingStatus,
  nextRelease,
  vestingEnd,
  setRefresh,
}: StatsPropsI): JSX.Element => {
  return (
    <Stack direction="row" spacing={2} justifyContent="space-between" p={2}>
      <Stat title="Vesting Status" attribute={true}>
        <Typography color={getVestingStatusColor(vestingStatus)}>
          {vestingStatus}
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
