import React from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { Trans } from "@lingui/macro";
import { DModalProps } from "./definitions";
import GlobalContext from "contexts/creators/global/global.context";
import theme from 'utils/material';
import { IoCloseCircleSharp } from "react-icons/io5";

const BaseModal = ({ onConfirm, onCancel, children }: DModalProps): JSX.Element => {
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
      <Box display="flex" flexDirection="column" gap={2} height="300px" width="50vw" m="15vh auto">
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h3" color={theme.palette.primary.dark}>{modal?.title || ''}</Typography>
          <IoCloseCircleSharp fontSize="small" onClick={handleCancel} color={theme.palette.primary.light} />
        </Box>
          <Typography variant="body1"> {modal?.content || null}</Typography>
          {children}
        <Box display="flex" justifyContent="space-between">
          {modal?.buttons?.cancel ? <Button variant="outlined" color="error" onClick={() => handleCancel()}><Trans>cancel</Trans></Button> : ''}
          {modal?.buttons?.confirm ? <Button variant="contained" color="success" onClick={() => handleConfirm()}><Trans>confirm</Trans></Button> : ''}
        </Box>
      </Box>
    </Modal>
  );
}

export default BaseModal;