import { Paper, SxProps } from "@mui/material";
import React from "react";

const paperStyle = {
  borderRadius: "10px",
  padding: "10px",
};

interface PropsI {
  sx?: SxProps;
  children: React.ReactNode;
}

const CustomPaper = ({ sx, children }: PropsI): JSX.Element => {
  return (
    <Paper variant="outlined" sx={{ ...paperStyle, ...sx }}>
      {children}
    </Paper>
  );
};

export default CustomPaper;
