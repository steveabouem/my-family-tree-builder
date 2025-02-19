import React, { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { Trans } from "@lingui/macro";
import { DModalProps } from "./definitions";
import GlobalContext from "contexts/creators/global/global.context";
import theme from 'utils/material';
import { IoCloseCircleSharp } from "react-icons/io5";

const BaseModal = ({ onConfirm, onCancel, children }: DModalProps): JSX.Element => {
  const [processing, setProcessing] = useState<boolean>(false);
  const { modal, updateModal } = React.useContext(GlobalContext);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }

    if (updateModal) updateModal({ ...modal, hidden: true });
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }

    if (updateModal) updateModal({ ...modal, hidden: true });
  };

  return (
    <Modal open={!modal?.hidden} id={modal?.id || ''}>
      <Box display="flex" flexDirection="column" gap={2} p={2} height="300px" width="30vw" m="15vh auto" justifyContent="space-between">
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Typography variant="h3" color={theme.palette.primary.dark}>{modal?.title || 'info'}</Typography>
          <IoCloseCircleSharp fontSize="small" onClick={handleCancel} color={theme.palette.primary.dark}  />
        </Box>
        <Typography variant="body1"> {modal?.content || null}</Typography>
        {children}
        <Box display="flex" justifyContent="space-between">
          {modal?.buttons?.cancel ? <Button variant="outlined" color="error" onClick={() => handleCancel()} sx={{marginLeft: 'auto'}}><Trans>cancel</Trans></Button> : ''}
          {modal?.buttons?.confirm ? <Button variant="contained" color="success" onClick={() => handleConfirm()} sx={{marginLeft: 'auto'}}><Trans>confirm</Trans></Button> : ''}
        </Box>
      </Box>
    </Modal>
  );
}

export default BaseModal;