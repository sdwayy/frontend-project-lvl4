import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import cn from 'classnames';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import {
  Modal, FormGroup, Button,
} from 'react-bootstrap';
import axios from 'axios';
import routes from '../../routes';
import { closeModal } from '../../slices/modal';

const InnerForm = () => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const channelsNames = useSelector((state) => state.channelsInfo.channels
    .map((channel) => channel.name));

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const validationSchema = Yup.object({
    name: Yup
      .string()
      .trim()
      .required('Please input a channel name')
      .notOneOf(channelsNames, 'Must be uniq')
      .min(3, 'Min name length is 3')
      .max(20, 'Max name length is 20'),
  });

  const submitHandler = async (values) => {
    const { name } = values;
    const attributes = { name: name.trim() };

    try {
      const url = routes.channelsPath();
      await axios.post(url, { data: { attributes } });
    } catch (error) {
      console.log('ERROR: ', error.message);
    }

    dispatch(closeModal());
  };

  const cancelHandler = () => dispatch(closeModal());

  return (
    <Formik
      initialValues={{ name: '' }}
      validationSchema={validationSchema}
      onSubmit={submitHandler}
    >
      {({ touched, isValid }) => (
        <Form>
          <Field
            className={cn({
              'mb-2': true,
              'form-control': true,
              'is-invalid': touched.name && !isValid,
            })}
            name="name"
            id="name"
            innerRef={inputRef}
          />
          <ErrorMessage
            component="span"
            className="mb-2 text-danger"
            name="name"
          />
          <FormGroup className="d-flex justify-content-end">
            <Button
              className="mr-2"
              variant="secondary"
              type="reset"
              onClick={cancelHandler}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </FormGroup>
        </Form>
      )}
    </Formik>
  );
};

export default function AddChannelModal() {
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Add channel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InnerForm />
      </Modal.Body>
    </>
  );
}
