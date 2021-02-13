import * as actions from '../../constants/redux-action-names';
import {useContext} from "react";
import AudioInstanceContext from "../../components/audio-instance-context";

const initialState = {
    isPlaying: false,
    id: null,
    previousId: null
};

const audioReducer = (state = initialState, action) => {

    switch (action.type) {
        case actions.AUDIO_PLAYED:
            return {
                previousId: state.id,
                isPlaying: true,
                id: action.payload,
            };
        case actions.AUDIO_STOPPED:
            return  {
                ...state,
                isPlaying: false,
                previousId: state.id
            };
        default:
            return state;
    }
};

export default audioReducer;
