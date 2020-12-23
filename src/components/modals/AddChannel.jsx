import React, { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import cn from 'classnames';

import {
  Modal,
  FormGroup,
  Button
} from 'react-bootstrap';

import axios from 'axios';
import routes from '../../routes';
import { closeModal } from '../../slices/modal';

const InnerForm = () => {
  const dispatch = useDispatch();
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const initialValues = {
    name: '',
  };

  const validationSchema = Yup.object({
    name: Yup
      .string()
      .required('This field is reqiered')
      .min(3, 'Min name length is 3')
      .max(20, 'Max name length is 20')
  });

  const submitHandler = (values) => {
    const { name } = values;
    const url = routes.channelsPath();
    const attributes = { name };
    
    axios.post(url, { data: { attributes } });
    dispatch(closeModal());
  };

  const cancelHandler = () => dispatch(closeModal());

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={submitHandler}
      >
        {(formik) => (
          <Form>
            <Field 
              className={cn({
                'mb-2': true,
                'form-control': true,
                'is-invalid': !formik.isValid,
              })}
              name='name'
              id='name'
              innerRef={inputRef}
            />
            <ErrorMessage
              component='span'
              className='mb-2 text-danger' 
              name='name' 
            />
            <FormGroup className='d-flex justify-content-end'>
              <Button 
                className='mr-2' 
                variant='secondary' 
                type='reset' 
                onClick={cancelHandler}
              >
                Cancel
              </Button>
              <Button 
                variant='primary' 
                type='submit'
              >
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
        <InnerForm/>
      </Modal.Body>
    </>
  );
};
