import React from 'react';
import { useSelector } from 'react-redux';

import Channels from './Channels';
import Chat from './Chat';
import Modal from './modals/index';

export default function App() {
  const modalIsOpened = useSelector((state) => state.modal.isOpened);

  return (
    <>
      <div className='h-100' id='chat'>
        <div className='row h-100 pb-3'>
          <Channels />
          <Chat />
        </div>
      </div>
      { modalIsOpened && <Modal /> }
    </>
  );
};
