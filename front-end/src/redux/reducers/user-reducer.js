import * as actions from '../../constants/redux-action-names';

const initialState = {
    loggedIn: false,
    cart: [],
    purchased: [],
    processing: false,
    email: null,
    username: null,
    error: null
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SIGN_UP_REQUESTED:
            return {
                ...state,
                error: null,
                processing: true
            }
        case actions.SIGN_UP_SUCCESS:

            return {
                ...state,
                loggedIn: true,
                processing: false,
                cart: action.payload.cart,
                purchased: action.payload.purchased,
                email: action.payload.email,
                username: action.payload.username,
            }
        case actions.SIGN_UP_FAILURE:
            return {
                ...state,
                processing: false,
                error: action.payload,
            }
        case actions.LOGGED_OUT:
            return initialState;

        case actions.LOG_IN_REQUESTED:
            return {
                ...state,
                processing: true
            }
        case actions.LOG_IN_SUCCESS:
            return {
                ...state,
                loggedIn: true,
                processing: false,
                cart: action.payload.cart,
                purchased: action.payload.purchased,
                email: action.payload.email,
                username: action.payload.username,
            }
        case actions.LOG_IN_FAILURE:
            return {
                ...state,
                processing: false,
                error: action.payload
            }
        default:
            return state;
    }
}

export default userReducer;