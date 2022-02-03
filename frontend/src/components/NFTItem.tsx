import { Button } from "@mui/material";
import { TokenI } from "./NFTGrid";

interface PropsI {
  token: TokenI;
}

const NFTItem = ({ token }: PropsI): JSX.Element => {
  return (
    <Button size="large" color={token.status} variant="contained">
      {token.id}
    </Button>
  );
};

export default NFTItem;
