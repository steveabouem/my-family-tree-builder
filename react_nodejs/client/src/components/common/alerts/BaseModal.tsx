import React, { useMemo } from "react";
import { Box, Button, Modal, Typography, useTheme } from "@mui/material";
import { Trans } from "@lingui/macro";
import { DModalProps } from "./definitions";
import GlobalContext from "contexts/creators/global/global.context";
import { IoCloseCircleSharp } from "react-icons/io5";
import { TbFileSad } from "react-icons/tb";
import { RiFileInfoLine } from "react-icons/ri";
import { TbFileSmile } from "react-icons/tb";

const BaseModal = ({ children, type = 'info' }: DModalProps): JSX.Element => {
  const { modal, updateModal } = React.useContext(GlobalContext);
  const seasonalTheme = useTheme();
  const headerIcon = useMemo(() => {
    switch (type) {
      case 'error':
        return <TbFileSad size={30} color="#e07e7e" />;
      case 'info':
        return <RiFileInfoLine size={30} color="#7eb4e0" />;
      case 'success':
        return <TbFileSmile size={30} color="#89e07e" />;
      default:
        return '';
    }
  }, [type]);

  const handleCancel = () => {
    if (modal?.onCancel) {
      modal?.onCancel();
    }

    updateModal({ ...modal, hidden: true });
  };

  const handleConfirm = () => {
    if (modal?.onConfirm) {
      modal.onConfirm(modal?.transferData);
    }
    updateModal({ ...modal, hidden: true });
  };

  return (
    <Modal open={!modal?.hidden} id={modal?.id || ''}>
      <Box display="flex" flexDirection="column" gap={2} p={2} height="300px" width="30vw" m="15vh auto" justifyContent="space-between" className={type}>
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" borderBottom="1px solid #bec9b2">
          <Box display="flex" gap={1} alignItems="center">
            {headerIcon}
            <Typography variant="h3" >{modal?.title || 'info'}</Typography>
          </Box>
          <IoCloseCircleSharp fontSize="medium" onClick={handleCancel} color={seasonalTheme.palette.primary.dark} />
        </Box>
        <Typography variant="body1"> {modal?.content || null}</Typography>
        {children}
        <Box display="flex" justifyContent="space-between">
          {modal?.buttons?.cancel ? <Button variant="outlined" color="error" onClick={() => handleCancel()} sx={{ marginLeft: 'auto' }}><Trans>cancel</Trans></Button> : ''}
          {modal?.buttons?.confirm ? <Button variant="contained" color="success" onClick={() => handleConfirm()} sx={{ marginLeft: 'auto' }}><Trans>confirm</Trans></Button> : ''}
        </Box>
      </Box>
    </Modal>
  );
}

export default BaseModal;