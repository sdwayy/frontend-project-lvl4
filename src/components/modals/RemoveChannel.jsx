import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Formik, Form } from 'formik';
import { Modal, Button, FormGroup } from 'react-bootstrap';
import routes from '../../routes';
import { closeModal } from '../../slices/modal';

const InnerForm = () => {
  const dispatch = useDispatch();
  const channelId = useSelector((state) => state.modal.extra.channelId);

  const closeModalHandler = () => {
    dispatch(closeModal());
  };

  const submitHandler = async () => {
    try {
      const url = routes.channelPath(channelId);
      await axios.delete(url);
    } catch (error) {
      console.log('ERROR: ', error.message);
    }

    dispatch(closeModal());
  };

  return (
    <Formik onSubmit={submitHandler} initialValues={{}}>
      <Form>
        <FormGroup className="d-flex justify-content-between">
          <Button
            variant="secondary"
            className="mr-2"
            type="reset"
            onClick={closeModalHandler}
          >
            Cancel
          </Button>
          <Button variant="danger" type="submit">Confirm</Button>
        </FormGroup>
      </Form>
    </Formik>
  );
};

export default function RemoveChannelModal() {
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Remove channel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure?
      </Modal.Body>
      <Modal.Footer>
        <InnerForm />
      </Modal.Footer>
    </>
  );
}
