import * as actions from '../../constants/redux-action-names';

const initialState = {
    beatList: [],
    isLoading: false,
    error: null
};

const beatsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.BEATS_REQUESTED:
            return {
                beatList: [],
                isLoading: true,
                error: null
            };
        case actions.BEATS_LOADED:
            return {
                beatList: action.payload,
                isLoading: false,
                error: null
            };
        case actions.BEATS_FAILURE:
            return {
                beatList: [],
                isLoading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export default beatsReducer;