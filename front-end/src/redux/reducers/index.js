import beatsReducer from "./beats-reducer";
import audioReducer from "./audio-reducer";
import userReducer from "./user-reducer";
import licensesReducer from "./licenses-reducer";

import {combineReducers} from "redux";


export default combineReducers({
    beatsReducer,
    audioReducer,
    userReducer,
    licensesReducer
});