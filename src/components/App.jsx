import React from 'react';
import Channels from './Channels';
import Chat from './Chat';

export default function App() {
  return (
    <div className='h-100' id='chat'>
      <div className='row h-100 pb-3'>
        <Channels />
        <Chat />
      </div>
    </div>
  );
};
