import { Stack, TextField, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import RefreshIcon from "@mui/icons-material/Refresh";
import { isAddress } from "ethers/lib/utils";
import React, { useState } from "react";

interface PropsI {
  vestingAddress: string;
  setVestingAddress: React.Dispatch<React.SetStateAction<string>>;
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditableAddress = ({
  vestingAddress,
  setVestingAddress,
  setRefreshData,
}: PropsI): JSX.Element => {
  const [tempAddress, setTempAddress] = useState(vestingAddress);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Stack direction="row" alignItems="center" justifyContent="center" p={2}>
      <TextField
        id="standard-basic"
        fullWidth
        label={"Contract Address"}
        onChange={(e) => setTempAddress(e.target.value)}
        variant="standard"
        value={tempAddress}
        disabled={!isEditing}
      />
      <IconButton
        onClick={() => {
          if (!isEditing) {
            return setIsEditing(true);
          }
          if (isEditing && isAddress(tempAddress)) {
            setIsEditing(false);
            setVestingAddress(tempAddress);
          }
        }}>
        {isEditing && isAddress(tempAddress) ? <DoneIcon /> : <EditIcon />}
      </IconButton>
      <IconButton onClick={() => setRefreshData((prev) => !prev)}>
        <RefreshIcon />
      </IconButton>
    </Stack>
  );
};

export default EditableAddress;
