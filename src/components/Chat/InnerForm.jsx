import axios from 'axios';
import * as Yup from 'yup';
import React, { useContext, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { Button, FormGroup } from 'react-bootstrap';
import routes from '../../routes';
import userContext from '../../context';

const sendMessage = async (attributes) => {
  const { currentChannelId } = attributes;

  try {
    const url = routes.channelMessagesPath(currentChannelId);
    await axios.post(url, { data: { attributes } });
  } catch (err) {
    console.log('ERROR: ', err);
  }
};

export default function InnerForm() {
  const { nickname, currentChannelId } = useSelector((state) => ({
    currentChannelId: state.channelsInfo.currentChannelId,
    nickname: useContext(userContext),
  }));

  const submitHandler = useCallback(
    async (values, formikBag) => {
      const { message } = values;
      const { resetForm } = formikBag;

      await sendMessage({ nickname, currentChannelId, body: message.trim() });
      resetForm();
    },
    [currentChannelId],
  );

  const validationSchema = Yup.object({
    message: Yup
      .string()
      .trim()
      .required('Please input a message'),
  });

  return (
    <Formik
      initialValues={{ message: '' }}
      onSubmit={submitHandler}
      validationSchema={validationSchema}
      validateOnMount
    >
      {({ isSubmitting, isValid }) => (
        <Form>
          <FormGroup className="d-flex">
            <Field
              className="form-control mr-2"
              name="message"
              id="message"
              placeholder="Input you're message"
            />
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              Submit
            </Button>
          </FormGroup>
        </Form>
      )}
    </Formik>
  );
}
