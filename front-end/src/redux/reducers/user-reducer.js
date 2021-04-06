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
    refreshToken: null,
    refreshTokenExpiration: null,
    expiration: null,
    id: null,
    isLoadingAppendToCart: false,
    isLoadingRemoveFromCart: false,
    isLoggingOut: false,
    showNotification: false,
    isProcessingPayment: false,
    payed: true,
    paymentError: {message: 'hello'},
    isConfirming: false,
    confirmationError: null
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
                processing: false
            }
        case actions.SIGN_UP_FAILURE:
            return {
                ...state,
                processing: false,
                error: action.payload,
            }
        case actions.LOGGED_OUT_REQUESTED:
            return {
                ...state,
                isLoggingOut: true,
            };
        case actions.LOGGED_OUT_SUCCESS:
            return {
                ...initialState,
                loggedIn: false,
                isLoggingOut: false,
                error: null
            }
        case actions.LOGGED_OUT_FAILED:
            return {
                ...state,
                loggedIn: false,
                isLoggingOut: false,
                error: action.payload
            }
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
                refreshToken: action.payload.refreshToken,
                refreshTokenExpiration: action.payload.refreshTokenExpiration,
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
        case actions.GOOGLE_SIGN_UP_REQUESTED:
            return {
                ...state,
                processing: true
            }
        case actions.GOOGLE_SIGN_UP_SUCCESS:
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
                refreshToken: action.payload.refreshToken,
                refreshTokenExpiration: action.payload.refreshTokenExpiration,
                expiration: action.payload.expiration,
                error: null
            }
        case actions.GOOGLE_SIGN_UP_FAILED:
            return {
                ...state,
                processing: false,
                error: action.payload
            }
        case actions.GOOGLE_LOG_IN_REQUESTED:
            return {
                ...state,
                processing: true
            }
        case actions.GOOGLE_LOG_IN_SUCCESS:
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
                refreshToken: action.payload.refreshToken,
                refreshTokenExpiration: action.payload.refreshTokenExpiration,
                expiration: action.payload.expiration,
                error: null
            }
        case actions.GOOGLE_LOG_IN_FAILED:
            return {
                ...state,
                processing: false,
                error: action.payload
            }
        case actions.REFRESH_TOKEN_REQUESTED:
            return {
                ...state
            }
        case actions.REFRESH_TOKEN_SUCCESS:
            return {
                ...state,
                token: action.payload.accessToken,
                expiration: action.payload.expiration,
                error: null
            }
        case actions.REFRESH_TOKEN_FAILED:
            return {
                ...state,
                error: action.payload
            }
        case actions.USER_ERROR_CLEARED:
            return {
                ...state,
                error: null
            }
        case actions.CART_ITEMS_SET:
            return {
                ...state,
                error: null,
                cart: action.payload
            }
        case actions.PAYMENT_REQUESTED:
            return {
                ...state,
                isProcessingPayment: true
            }
        case actions.CONFIRMATION_REQUESTED:
            return {
                ...state,
                isConfirming: true
            }
        case actions.CONFIRMATION_SUCCESS:
            return {
                ...state,
                id: action.payload.id,
                loggedIn: true,
                isConfirming: false,
                cart: action.payload.cart,
                purchased: action.payload.purchased,
                email: action.payload.email,
                username: action.payload.username,
                token: action.payload.token,
                refreshToken: action.payload.refreshToken,
                refreshTokenExpiration: action.payload.refreshTokenExpiration,
                expiration: action.payload.expiration,
                error: null
            }
        case actions.CONFIRMATION_FAILED:
            return {
                ...state,
                confirmationError: action.payload,
                isConfirming: false
            }
        case actions.CONFIRMATION_ERROR_REMOVED:
            return {
                ...state,
                confirmationError: null
            }
        case actions.CART_CLEARED:
            return {
                ...state,
                cart: {
                    items: [],
                    total: 0
                }
            }
        case actions.PAYMENT_ACCEPTED:
            return {
                ...state,
                payed: true,
                isProcessingPayment: false
            }
        case actions.PAYMENT_ACCEPTANCE_DROP:
            return {
                ...state,
                payed: false
            }
        case actions.PAYMENT_DECLINED:
            return {
                ...state,
                paymentError: action.payload,
                isProcessingPayment: false
            }
        case actions.PAYMENT_DECLINE_DROP:
            return {
                ...state,
                paymentError: null
            }
        case actions.PAYMENT_CANCELED:
            return {
                ...state,
                paymentError: null,
                isProcessingPayment: false
            }
        default:
            return state;
    }
}

export default userReducer;
