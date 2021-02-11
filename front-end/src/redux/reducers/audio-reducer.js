import * as actions from '../../constants/redux-action-names';

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
                isPlaying: false,
                id: null,
                previousId: state.id
            };
        default:
            return state;
    }
};

export default audioReducer;
