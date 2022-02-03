import { useWeb3React } from "@web3-react/core";
import { connector, getAccountString } from "../utils/walletUtils";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Button } from "@mui/material";

const Wallet = (): JSX.Element => {
  const { activate, account } = useWeb3React();

  const connectWallet = () => {
    activate(connector, (err) => {
      console.error(err);
    });
  };

  return (
    <Button
      onClick={connectWallet}
      variant="contained"
      startIcon={<AccountBalanceWalletIcon />}>
      {getAccountString(account)}
    </Button>
  );
};

export default Wallet;
