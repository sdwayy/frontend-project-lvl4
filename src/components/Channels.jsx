import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import {
  ButtonGroup,
  Dropdown,
  Nav,
  Button,
} from 'react-bootstrap';
import { swapChannel } from '../slices/channels';
import { showModal } from '../slices/modal';

const NotRemovableChannel = (options) => {
  const dispatch = useDispatch();
  const { name, isActive, id } = options;

  const clickHandler = () => dispatch(swapChannel(id));

  return (
    <Nav.Link
      className={cn({
        'btn-block': true,
        'mb-2': true,
        'text-left': true,
        'btn-primary': isActive,
        'btn-light': !isActive,
      })}
      onClick={clickHandler}
      as="button"
    >
      {name}
    </Nav.Link>
  );
};

const RemovableChannel = (options) => {
  const dispatch = useDispatch();
  const { isActive, name, id } = options;

  const clickHandler = () => dispatch(swapChannel(id));

  const removeHandler = (channelId) => () => dispatch(showModal({
    type: 'removeChannel',
    extra: { channelId },
  }));

  const renameHandler = (channelId) => () => dispatch(showModal({
    type: 'renameChannel',
    extra: { channelId },
  }));

  return (
    <Dropdown as={ButtonGroup} className="mb-2 d-flex">
      <Button
        variant={isActive ? 'primary' : 'light'}
        className="text-left flex-grow-1"
        onClick={clickHandler}
      >
        {name}
      </Button>

      <Dropdown.Toggle
        split
        variant={isActive ? 'primary' : 'light'}
        className="flex-grow-0"
      />

      <Dropdown.Menu>
        <Dropdown.Item onClick={removeHandler(id)}>Remove</Dropdown.Item>
        <Dropdown.Item onClick={renameHandler(id)}>Rename</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default function Channels() {
  const dispatch = useDispatch();
  const { channels, currentChannelId } = useSelector((state) => state.channelsInfo);

  const channelsElements = channels.map(({ id, name, removable }) => {
    const isActive = id === currentChannelId;

    return (
      <Nav.Item id={id} key={id} as="li">
        {removable
          ? RemovableChannel({ name, isActive, id })
          : NotRemovableChannel({ name, isActive, id })}
      </Nav.Item>
    );
  });

  const addChannelHandler = () => {
    dispatch(showModal({ type: 'addChannel' }));
  };

  return (
    <div className="col-3 border-right">
      <div className="d-flex mb-2">
        <span>Channels</span>
        <Button
          className="ml-auto p-0"
          variant="link"
          onClick={addChannelHandler}
        >
          +
        </Button>
      </div>
      <Nav className="flex-column" variant="pills" fill as="ul">
        {channels.length > 0 && channelsElements}
      </Nav>
    </div>
  );
}
