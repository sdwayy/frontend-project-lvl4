import { combineReducers } from 'redux';
import channelsInfo from './channels';
import messagesInfo from './messages';
import modal from './modal';

export default combineReducers({
  channelsInfo,
  messagesInfo,
  modal
});