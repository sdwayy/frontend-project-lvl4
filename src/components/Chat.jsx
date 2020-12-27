import React, { useContext, useCallback } from 'react';
import axios from 'axios';
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
    (values, formikBag) => {
      const { message } = values;
      const { resetForm } = formikBag;

      sendMessage({ nickname, currentChannelId, body: message });
      resetForm();
    },
    [currentChannelId],
  );

  return (
    <Formik
      initialValues={{ message: '' }}
      onSubmit={submitHandler}
    >
      <Form>
        <FormGroup className="d-flex">
          <Field
            className="form-control mr-2"
            name="message"
            id="message"
          />
          <Button type="submit">Submit</Button>
        </FormGroup>
      </Form>
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

  const { currentChannelId, currentMessages } = channelData;

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
          <InnerForm nickname={nickname} currentChannelId={currentChannelId} />
        </div>
      </div>
    </div>
  );
}
