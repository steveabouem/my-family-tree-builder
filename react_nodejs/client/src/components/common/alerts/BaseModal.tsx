import React, { useContext } from "react";
import { Modal } from "react-bootstrap";
import { DModalProps } from "./definitions";
import GlobalContext from "../../../context/creators/global.context";
import { Trans } from "@lingui/macro";

const BaseModal = ({ onConfirm, onCancel, children }: DModalProps): JSX.Element => {
  const { modal, updateModal } = useContext(GlobalContext);

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
    <Modal show={!modal?.hidden} onHide={handleCancel} id={modal?.id || ''}>
      <Modal.Header closeButton>
        <Modal.Title>{modal?.title || ''}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modal?.content || null}
        {children}
      </Modal.Body>
      <Modal.Footer>
        {modal?.buttons?.cancel ? <button onClick={() => handleCancel()}><Trans>cancel</Trans></button> : <></>}
        {modal?.buttons?.confirm ? <button onClick={() => handleConfirm()}><Trans>confirm</Trans></button> : <></>}
      </Modal.Footer>
    </Modal>
  );
}

export default BaseModal;