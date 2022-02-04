import { Stack, TextField, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import { isAddress } from "ethers/lib/utils";
import React, { useState } from "react";

interface PropsI {
  vestingAddress: string;
  setVestingAddress: React.Dispatch<React.SetStateAction<string>>;
}

const EditableAddress = ({
  vestingAddress,
  setVestingAddress,
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
    </Stack>
  );
};

export default EditableAddress;
