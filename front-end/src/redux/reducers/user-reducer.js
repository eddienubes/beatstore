import * as actions from '../../constants/redux-action-names';

const initialState = {
    loggedIn: false,
    cart: {
        items: [],
        total: 0
    },
    purchased: [],
    processing: false,
    email: null,
    username: null,
    error: null,
    token: null,
    expiration: null,
    id: null,
    isLoadingAppendToCart: false,
    isLoadingRemoveFromCart: false,
    showNotification: false
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SIGN_UP_REQUESTED:
            return {
                ...state,
                processing: true
            }
        case actions.SIGN_UP_SUCCESS:
            return {
                ...state,
                id: action.payload.id,
                loggedIn: true,
                processing: false,
                cart: action.payload.cart,
                purchased: action.payload.purchased,
                email: action.payload.email,
                username: action.payload.username,
                token: action.payload.token,
                expiration: action.payload.expiration
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
                id: action.payload.id,
                loggedIn: true,
                processing: false,
                cart: action.payload.cart,
                purchased: action.payload.purchased,
                email: action.payload.email,
                username: action.payload.username,
                token: action.payload.token,
                expiration: action.payload.expiration,
                error: null
            }
        case actions.LOG_IN_FAILURE:
            return {
                ...state,
                processing: false,
                error: action.payload
            }
        case actions.USER_UPDATE_REQUESTED:
            return {
                ...state,
                processing: true
            }
        case actions.USER_UPDATED_SUCCESS:
            return {
                ...state,
                username: action.payload.username,
                email: action.payload.email,
                processing: false,
                error: null
            }
        case actions.USER_UPDATE_FAILURE:
            return {
                ...state,
                processing: false,
                error: action.payload
            }
        case actions.APPEND_TO_CART_REQUESTED:
            return {
                ...state,
                isLoadingAppendToCart: true
            }
        case actions.APPEND_TO_CART_SUCCESS:
            return {
                ...state,
                isLoadingAppendToCart: false,
                cart: {
                    items: [
                        ...action.payload.items
                    ],
                    total: action.payload.total
                },
                showNotification: true
            }
        case actions.APPEND_TO_CART_FAILURE:
            return {
                ...state,
                error: action.payload,
                isLoadingAppendToCart: false
            }
        case actions.REMOVE_FROM_CART_REQUESTED:
            return {
                ...state,
                isLoadingRemoveFromCart: true
            }
        case actions.REMOVE_FROM_CART_SUCCESS: {
            return {
                ...state,
                cart: {
                    items: action.payload.items,
                    total: action.payload.total
                },
                isLoadingRemoveFromCart: false
            }
        }
        case actions.REMOVE_FROM_CART_FAILURE:
            return {
                ...state,
                isLoadingRemoveFromCart: false,
                error: action.payload
            }
        case actions.NOTIFICATION_CLOSED:
            return {
                ...state,
                showNotification: false
            }
        default:
            return state;
    }
}

export default userReducer;
