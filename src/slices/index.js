import { combineReducers } from 'redux';
import channelsInfo from './channels';
import messagesInfo from './messages';

export default combineReducers({
  channelsInfo,
  messagesInfo,
});