import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {
  Modal, Button, Form,
} from 'react-bootstrap';
import routes from '../../routes';
import { closeModal } from '../../slices/modal';

export default function RemoveChannelModal() {
  const dispatch = useDispatch();
  const channelId = useSelector((state) => state.modal.extra.channelId);

  const closeModalHandler = () => {
    dispatch(closeModal());
  };

  const submitHandler = (evt) => {
    evt.preventDefault();

    const url = routes.channelPath(channelId);

    axios.delete(url);
    dispatch(closeModal());
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Remove channel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure?
      </Modal.Body>
      <Modal.Footer>
        <Form className="d-block w-100" onSubmit={submitHandler}>
          <Form.Group className="d-flex justify-content-between">
            <Button
              variant="secondary"
              className="mr-2"
              type="reset"
              onClick={closeModalHandler}
            >
              Cancel
            </Button>
            <Button variant="danger" type="submit">Confirm</Button>
          </Form.Group>
        </Form>
      </Modal.Footer>
    </>
  );
}
