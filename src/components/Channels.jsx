import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import {
  ButtonGroup, Dropdown, Nav, Button,
} from 'react-bootstrap';
import { swapChannel } from '../slices/channels';
import { showModal } from '../slices/modal';

const Channel = ({
  name, isActive, id, removable,
}) => {
  const dispatch = useDispatch();

  const clickHandler = () => dispatch(swapChannel({ id }));

  const removeHandler = () => dispatch(showModal({
    type: 'removeChannel',
    extra: { channelId: id },
  }));

  const renameHandler = () => dispatch(showModal({
    type: 'renameChannel',
    extra: { channelId: id },
  }));

  return !removable
    ? (
      <Nav.Link
        className={cn({
          'w-100': true,
          'text-left': true,
          'mb-2': true,
          btn: true,
          'btn-primary': isActive,
          'btn-light': !isActive,
        })}
        as="button"
        onClick={clickHandler}
      >
        {name}
      </Nav.Link>
    )
    : (
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
          <Dropdown.Item onClick={removeHandler}>Remove</Dropdown.Item>
          <Dropdown.Item onClick={renameHandler}>Rename</Dropdown.Item>
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
        <Channel name={name} id={id} removable={removable} isActive={isActive} />
      </Nav.Item>
    );
  });

  const addChannelHandler = () => dispatch(showModal({ type: 'addChannel' }));

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
        {channelsElements}
      </Nav>
    </div>
  );
}
