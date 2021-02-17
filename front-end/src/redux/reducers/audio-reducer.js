import * as actions from '../../constants/redux-action-names';
import {useContext} from "react";
import AudioInstanceContext from "../../components/audio-instance-context";

const initialState = {
    isPlaying: false,
    id: null,
    previousId: null,
    played: 0,
    loaded: 0
};

const audioReducer = (state = initialState, action) => {

    switch (action.type) {
        case actions.AUDIO_PLAYED:
            return {
                ...state,
                isPlaying: true,
            };
        case actions.AUDIO_STOPPED:
            return  {
                ...state,
                isPlaying: false,
                previousId: state.id
            };
        case actions.AUDIO_LOADED:
            return {
                id: action.payload,
                previousId: action.payload,
                isPlaying: true,
                played: 0,
                loaded: 0
            }
        case actions.AUDIO_LENGTH_PLAYED:
            return {
                ...state,
                played: action.payload
            }
        case actions.AUDIO_LENGTH_LOADED:
            return {
                ...state,
                loaded: action.payload
            }
        default:
            return state;
    }
};

export default audioReducer;
