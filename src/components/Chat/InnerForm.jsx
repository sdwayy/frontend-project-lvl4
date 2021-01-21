import axios from 'axios';
import * as Yup from 'yup';
import React, { useContext, useRef } from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { Button, FormGroup } from 'react-bootstrap';
import routes from '../../routes';
import userContext from '../../context';

const validationSchema = Yup.object({
  message: Yup
    .string()
    .trim()
    .required('Please input a message'),
});

export default function InnerForm() {
  const { nickname, currentChannelId } = useSelector((state) => ({
    currentChannelId: state.channelsInfo.currentChannelId,
    nickname: useContext(userContext),
  }));

  const inputRef = useRef();

  const submitHandler = async ({ message }, { resetForm, setFieldError }) => {
    try {
      const url = routes.channelMessagesPath(currentChannelId);
      const attributes = {
        nickname,
        currentChannelId,
        body: message.trim(),
      };

      await axios.post(url, { data: { attributes } });
      resetForm();
    } catch (error) {
      setFieldError('message', error.message);
    }
    inputRef.current.focus();
  };

  return (
    <Formik
      initialValues={{ message: '' }}
      onSubmit={submitHandler}
      validationSchema={validationSchema}
      validateOnBlur={false}
    >
      {({ isSubmitting, isValid, touched }) => (
        <Form>
          <FormGroup className="d-flex">
            <Field
              className={cn({
                'form-control': true,
                'mr-2': true,
                'is-invalid': !isValid && touched.message,
              })}
              name="message"
              id="message"
              placeholder="Input you're message"
              innerRef={inputRef}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </FormGroup>
          <ErrorMessage
            component="span"
            className="ml-1 text-danger"
            name="message"
          />
        </Form>
      )}
    </Formik>
  );
}
