import * as actions from '../../constants/redux-action-names';

const initialState = {
  isLoading: false,
  error: null,
  licenses: []
};

const licensesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.LICENSES_REQUESTED:
      return {
        ...state,
        isLoading: true
      };
    case actions.LICENSES_SUCCESS:
      return {
        isLoading: false,
        licenses: action.payload
      };
    case actions.LICENSES_FAILURE:
      return {
        isLoading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default licensesReducer;
