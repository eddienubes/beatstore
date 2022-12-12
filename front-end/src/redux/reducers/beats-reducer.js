import * as actions from '../../constants/redux-action-names';
import { NUMBER_OF_BEATS_PER_LOAD } from '../../constants/other-constants';

const initialState = {
  beatList: [],
  isLoading: false,
  isLoadingInfo: false,
  error: null,
  hasMore: true,
  skip: 0,
  filter: {
    bpm: null,
    moods: null,
    genres: null,
    tags: null,
    search: ''
  },
  info: {
    bpms: [],
    genres: [],
    moods: [],
    tags: []
  },
  isFiltering: false
};

const beatsReducer = (state = initialState, action) => {
  let hasMore = true;
  let skip;

  switch (action.type) {
    case actions.BEATS_REQUESTED:
      return {
        ...state,
        isLoading: true
      };
    case actions.BEATS_LOADED:
      if (action.payload.beats.length === 0) {
        hasMore = !hasMore;
      }
      if (action.payload.limit) {
        skip = action.payload.limit;
      } else {
        skip = state.skip + NUMBER_OF_BEATS_PER_LOAD;
      }
      return {
        ...state,
        beatList: [...state.beatList, ...action.payload.beats],
        isLoading: false,
        hasMore,
        skip
      };
    case actions.BEATS_DROPPED:
      return {
        ...state,
        beatList: [],
        skip: 0,
        hasMore: true
      };
    case actions.BEATS_FAILURE:
      return {
        ...state,
        hasMore: false,
        beatList: [],
        isLoading: false,
        error: action.payload
      };
    case actions.BEATS_INFO_REQUESTED:
      return {
        ...state,
        isLoadingInfo: true
      };
    case actions.BEATS_INFO_SUCCESS:
      return {
        ...state,
        isLoadingInfo: false,
        info: action.payload
      };
    case actions.BEATS_INFO_FAILURE:
      return {
        ...state,
        isLoadingInfo: false,
        error: action.payload,
        hasMore: false
      };
    case actions.FILTER_REQUESTED:
      return {
        ...state,
        isFiltering: true
      };
    case actions.FILTER_SUCCESS:
      if (action.payload.beats.length === 0) {
        hasMore = !hasMore;
      }
      console.log({
        ...state.filter,
        ...action.payload.filter
      });
      return {
        ...state,
        skip: action.payload.limit,
        isFiltering: false,
        beatList: action.payload.beats,
        hasMore,
        filter: {
          ...action.payload.filter,
          search: state.filter.search
        }
      };
    case actions.FILTER_SEARCH_SET:
      return {
        ...state,
        filter: {
          ...state.filter,
          search: action.payload
        }
      };
    case actions.FILTER_DROPPED:
      return initialState;
    case actions.FILTER_FAILURE:
      return {
        ...state,
        isLoading: false,
        isFiltering: false,
        error: action.payload,
        hasMore: false
      };
    default:
      return state;
  }
};

export default beatsReducer;
