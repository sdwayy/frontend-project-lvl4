import React from 'react';
import { useSelector } from 'react-redux';

export default function MessagesBox() {
  const currentMessages = useSelector((state) => {
    const { currentChannelId } = state.channelsInfo;
    const { messages } = state.messagesInfo;

    return messages.filter((message) => message.channelId === currentChannelId);
  });

  const messagesElements = currentMessages.map(({ body, id, nickname }) => (
    <div key={id}>
      <b>{nickname}</b>
      :
      {body}
    </div>
  ));

  return (
    <div className="chat-messages overflow-auto mb-3" id="messages-box">
      { currentMessages.length > 0 && messagesElements }
    </div>
  );
}
