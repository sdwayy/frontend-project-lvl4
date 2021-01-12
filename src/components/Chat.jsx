import React, { useContext, useCallback } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { Button, FormGroup } from 'react-bootstrap';
import routes from '../routes';
import userContext from '../context';

const sendMessage = async (attributes) => {
  const { currentChannelId } = attributes;

  try {
    const url = routes.channelMessagesPath(currentChannelId);
    await axios.post(url, { data: { attributes } });
  } catch (err) {
    console.log('ERROR: ', err);
  }
};

const InnerForm = () => {
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
    [currentChannelId, nickname],
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
};

export default function Chat() {
  const nickname = useContext(userContext);

  const channelData = useSelector((state) => {
    const { currentChannelId } = state.channelsInfo;
    const { messages } = state.messagesInfo;
    const currentMessages = messages
      .filter((message) => message.channelId === currentChannelId);

    return { currentChannelId, currentMessages };
  });

  const { currentMessages } = channelData;

  const messagesElements = currentMessages.map((message) => {
    const { body, id } = message;

    return (
      <div key={id}>
        <b>{nickname}</b>
        :
        {body}
      </div>
    );
  });

  return (
    <div className="col h-100">
      <div className="d-flex flex-column h-100">
        <div className="chat-messages overflow-auto mb-3" id="messages-box">
          { currentMessages.length > 0 && messagesElements }
        </div>
        <div className="mt-auto">
          <InnerForm />
        </div>
      </div>
    </div>
  );
}
