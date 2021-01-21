import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import {
  Modal, Button, FormGroup,
} from 'react-bootstrap';
import cn from 'classnames';
import * as Yup from 'yup';
import routes from '../../routes';
import { closeModal } from '../../slices/modal';

const InnerForm = () => {
  const dispatch = useDispatch();
  const channelId = useSelector((state) => state.modal.extra.channelId);
  const currentChannelName = useSelector((state) => state.channelsInfo.channels)
    .find((channel) => channel.id === channelId)
    .name;
  const channelsNames = useSelector((state) => state.channelsInfo.channels)
    .map((channel) => channel.name);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
    inputRef.current.select();
  }, []);

  const cancelHandler = () => dispatch(closeModal());

  const mainValidationSchema = Yup.object({
    name: Yup
      .string()
      .trim()
      .notOneOf(channelsNames, 'Must be uniq')
      .min(3, 'Min name length is 3')
      .max(20, 'Max name length is 20'),
  });

  const submitValidationShema = Yup.string().required();

  const submitHandler = async ({ name }, { setFieldError }) => {
    const attributes = { name };

    if (!submitValidationShema.isValidSync(name)) {
      setFieldError('name', 'required');
      return;
    }

    try {
      const url = routes.channelPath(channelId);
      await axios.patch(url, { data: { attributes } });
      dispatch(closeModal());
    } catch (error) {
      setFieldError('name', error.message);
    }
  };

  return (
    <Formik
      initialValues={{ name: currentChannelName }}
      validationSchema={mainValidationSchema}
      onSubmit={submitHandler}
      validateOnBlur={false}
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
            <Button
              variant="primary"
              type="submit"
            >
              Submit
            </Button>
          </FormGroup>
        </Form>
      )}
    </Formik>
  );
};

export default function RenameChannel() {
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Rename channel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InnerForm />
      </Modal.Body>
    </>
  );
}
