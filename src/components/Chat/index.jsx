import React from 'react';
import InnerForm from './InnerForm';
import MessagesBox from './MesaggesBox';

export default function Chat() {
  return (
    <div className="col h-100">
      <div className="d-flex flex-column h-100">
        <MessagesBox />
        <div className="mt-auto">
          <InnerForm />
        </div>
      </div>
    </div>
  );
}
