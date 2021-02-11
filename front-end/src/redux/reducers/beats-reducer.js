import * as actions from '../../constants/redux-action-names';
import {NUMBER_OF_BEATS_PER_LOAD} from "../../constants/other-constants";


const initialState = {
    beatList: [],
    isLoading: false,
    error: null,
    hasMore: true,
    skip: 0
};

const beatsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.BEATS_REQUESTED:
            return {
                ...state,
                isLoading: true,
                error: null
            };
        case actions.BEATS_LOADED:
            let hasMore = true;
            let skip;
            if (action.payload.beats.length === 0) {
                hasMore = !hasMore;
            }
            if (action.payload.limit) {
                skip = action.payload.limit
            }
            else {
                skip = state.skip + NUMBER_OF_BEATS_PER_LOAD
            }
            return {
                beatList: [...state.beatList, ...action.payload.beats],
                isLoading: false,
                error: null,
                hasMore,
                skip
            };
        case actions.BEATS_FAILURE:
            return {
                hasMore: false,
                beatList: [],
                isLoading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export default beatsReducer;