import beatsReducer from "./beats-reducer";
import audioReducer from "./audio-reducer";

import {combineReducers} from "redux";


export default combineReducers({
    beatsReducer,
    audioReducer
});