import React from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
 
export default function Channels() {
  const channelsData = useSelector((state) => {
    const { channels, currentChannelId } = state.channelsInfo;

    return { channels, currentChannelId};
  });

  const { channels, currentChannelId } = channelsData;

  const channelsElements =  channels.map(({ id, name }) => {
    const isActiveChannel = id === currentChannelId;
    const channelElementClasses = cn(
      'btn',
      'btn-block',
      'nav-link',
      'mb-2',
      'text-left',
      { 
        'btn-primary': isActiveChannel,
        'btn-light': !isActiveChannel
      }
    )

    return (
      <li className='nav-item' id={id} key={id}>
      <button type='button' className={channelElementClasses}>
        {name}
      </button>
      </li>
  )});

  return (
    <div className='col-3 border-right'>
      <div className='d-flex mb-2'>
        <span>Channels</span>
        <button type='button' className='ml-auto p-0 btn btn-link'>+</button>
      </div>
      <ul className='nav flex-column nav-pills nav-fill'>
        {channels.length > 0 && channelsElements}
      </ul>
    </div>
  );
}