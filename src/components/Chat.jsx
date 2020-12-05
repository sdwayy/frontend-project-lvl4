import React, { useContext, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
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

export default function Chat() {
  const inputRef = useRef(null);

  const messagesData = useSelector((state) => {
    const { currentChannelId } = state.channelsInfo;
    const { messages } = state.messagesInfo;

    return { currentChannelId, messages };
  });

  const { currentChannelId, messages } = messagesData;
  const nickname = useContext(userContext);

  const messagesElements = messages.map((message, i) => {
    const { body } = message;

    return (
      <div key={i}>
        <b>{nickname}</b>: {body}
      </div>
    );
  });

  const submitHandler = (evt) => {
    evt.preventDefault();

    const body = inputRef.current.value;

    sendMessage({ nickname, currentChannelId, body });
  };

  return (
    <div className='col h-100'>
      <div className='d-flex flex-column h-100'>
        <div className='chat-messages overflow-auto mb-3' id='messages-box'>
          { messages.length > 0 && messagesElements }
        </div>
        <div className='mt-auto'>
          <form noValidate onSubmit={submitHandler}>
            <div className='form-group'>
              <div className='input-group'>
                <input 
                  ref={inputRef}
                  className='mr-2 form-control' 
                  name='body' 
                  aria-label='body'
                >
                </input>
                <button 
                  aria-label='submit'
                  type='submit'
                  className='btn btn-primary'
                >
                  Submit
                </button>
                <div className='d-block invalid-feedback'>&nbsp;</div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};