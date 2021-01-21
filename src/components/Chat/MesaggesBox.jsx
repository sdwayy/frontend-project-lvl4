import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function MessagesBox() {
  const currentMessages = useSelector((state) => {
    const { currentChannelId } = state.channelsInfo;
    const { messages } = state.messagesInfo;

    return messages.filter((message) => message.channelId === currentChannelId);
  });

  const messageBoxRef = useRef();

  useEffect(() => {
    const messageBox = messageBoxRef.current;
    messageBox.scrollTop = messageBox.scrollHeight;
  });

  const messagesElements = currentMessages.map(({ body, id, nickname }) => (
    <div className="text-break" key={id}>
      <b>{nickname}</b>
      :
      {body}
    </div>
  ));

  return (
    <div
      className="chat-messages overflow-auto mb-3"
      id="messages-box"
      ref={messageBoxRef}
    >
      { currentMessages.length > 0 && messagesElements }
    </div>
  );
}
