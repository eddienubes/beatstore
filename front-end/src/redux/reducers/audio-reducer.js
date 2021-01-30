import * as actions from '../../constants/redux-action-names';

const initialState = {
    isPlaying: false,
    id: null,
};

const audioReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.AUDIO_PLAYED:
            return {
                isPlaying: true,
                id: action.payload,
            };
        case actions.AUDIO_STOPPED:
            return  {
                isPlaying: false,
                id: null,
            };
        default:
            return state;
    }
};

export default audioReducer;
