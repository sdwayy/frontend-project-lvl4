import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { closeModal } from '../../slices/modal';
import AddChannel from './AddChannel';
import RemoveChannel from './RemoveChannel';
import RenameChannel from './RenameChannel';

export default function ModalComponent() {
  const dispatch = useDispatch();
  const { isOpened, type } = useSelector((state) => state.modal);

  const getModal = (modalType) => {
    const typeMap = {
      addChannel: AddChannel,
      removeChannel: RemoveChannel,
      renameChannel: RenameChannel,
    };

    return typeMap[modalType]();
  };

  const hideModalHandler = () => dispatch(closeModal());

  return (
    <Modal
      show={isOpened}
      onHide={hideModalHandler}
      keyboard
    >
      { getModal(type) }
    </Modal>
  );
}
