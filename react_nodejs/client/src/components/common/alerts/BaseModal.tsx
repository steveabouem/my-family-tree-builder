import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "react-bootstrap";
import { DModalProps } from "./definitions";

const BaseModal = ({ id, hidden, title, content, onConfirm, onCancel, children }: DModalProps): JSX.Element => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    setVisible(!hidden);
  }, []);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setVisible(false);
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    setVisible(false);
  };

  return (
    <Modal show={visible} onHide={handleCancel} id={id}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {content || null}
        {children || null}
      </Modal.Body>
      <Modal.Footer>
        <button onClick={() => handleCancel()}>Cancel</button>
        <button onClick={() => handleConfirm()}>Confirm</button>
      </Modal.Footer>
    </Modal>

  );
}

export default BaseModal;