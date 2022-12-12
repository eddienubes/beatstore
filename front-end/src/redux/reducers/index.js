import { combineReducers } from 'redux';
import beatsReducer from './beats-reducer';
import audioReducer from './audio-reducer';
import userReducer from './user-reducer';
import licensesReducer from './licenses-reducer';

export default combineReducers({
  beatsReducer,
  audioReducer,
  userReducer,
  licensesReducer
});
