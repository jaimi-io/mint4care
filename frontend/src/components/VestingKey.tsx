import { Stack, Typography, Grid, Box } from "@mui/material";

interface ColorKeyPropsI {
  color: string;
  title: string;
}

const ColorKey = ({ color, title }: ColorKeyPropsI): JSX.Element => {
  return (
    <Grid container item spacing={2} alignItems="center">
      <Grid item lg={3} md={4}>
        <Box
          sx={{
            backgroundColor: color,
            color,
          }}>
          a
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Typography>{title}</Typography>
      </Grid>
    </Grid>
  );
};

interface VestingKeyPropsI {
  colorKeys: ColorKeyPropsI[];
}

const VestingKey = ({ colorKeys }: VestingKeyPropsI): JSX.Element => {
  return (
    <Stack justifyContent="space-around" p={4}>
      {colorKeys.map(({ color, title }) => (
        <ColorKey color={color} title={title} />
      ))}
    </Stack>
  );
};

export default VestingKey;
