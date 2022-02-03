import { Stack, Typography, Grid, Box } from "@mui/material";

interface ColorKeyPropsI {
  color: string;
  title: string;
}

const ColorKey = ({ color, title }: ColorKeyPropsI): JSX.Element => {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item lg={1} md={2}>
        <Box
          sx={{
            backgroundColor: color,
            color,
          }}>
          a
        </Box>
      </Grid>
      <Grid item xs={10}>
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
    <Stack>
      <Typography sx={{ textDecoration: "underline" }} variant="h6">
        Key
      </Typography>
      {colorKeys.map(({ color, title }) => (
        <ColorKey color={color} title={title} />
      ))}
    </Stack>
  );
};

export default VestingKey;
