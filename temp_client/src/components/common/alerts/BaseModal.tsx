import React, { useMemo } from "react";
import { Box, Button, Modal, Typography, useTheme } from "@mui/material";
import { Trans } from "@lingui/macro";
import { IoCloseCircleSharp } from "react-icons/io5";
import { TbFileSad } from "react-icons/tb";
import { RiFileInfoLine } from "react-icons/ri";
import { TbFileSmile } from "react-icons/tb";
import styled from "styled-components";
import { ModalProps } from "types";
import GlobalContext from "contexts/creators/global/global.context";

const BaseModal = ({ children, type = 'info', buttons }: ModalProps): JSX.Element => {
  const cancelText = buttons?.cancelText;
  const confirmText = buttons?.confirmText;
  const { modal, clearModal} = React.useContext(GlobalContext);
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

    clearModal();
  };

  const handleConfirm = () => {
    if (modal?.onConfirm) {
      modal.onConfirm(modal?.transferData);
      clearModal();
    } else {
      clearModal();
    }
  };

  return (
    <Modal open={!modal?.hidden} id={modal?.id || ''}>
      <ResponsiveModalContent 
        display="flex" flexDirection="column" gap={2} p={2} height="300px" 
        justifyContent="space-between" className={type} borderRadius={2}
      >
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
          {modal?.buttons?.cancel ? <Button variant="outlined" color="error" onClick={() => handleCancel()} sx={{ marginLeft: 'auto' }}>{cancelText || <Trans>cancel</Trans>}</Button> : ''}
          {modal?.buttons?.confirm ? <Button variant="contained" color="success" onClick={() => handleConfirm()} sx={{ marginLeft: 'auto' }}>{confirmText || <Trans>confirm</Trans>}</Button> : ''}
        </Box>
      </ResponsiveModalContent>
    </Modal>
  );
};

const ResponsiveModalContent = styled(Box)`
  width: 30vw;
  margin: 15vh auto;
  @media (max-width: 768px) {
    width: 60vw;
  }
`;

export default BaseModal;