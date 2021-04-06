import * as actions from '../../constants/redux-action-names';
import AuthService from "../../services/auth-service";
import BeatstoreService from "../../services";
import LicensesService from "../../services/licenses-service";

const beatstoreService = new BeatstoreService();
const authService = new AuthService();
const licensesService = new LicensesService();

const beatsRequested = () => {
    return {
        type: actions.BEATS_REQUESTED,
    };
};

const beatsLoaded = (payload) => {
    return {
        type: actions.BEATS_LOADED,
        payload: payload
    };
};


const beatsFailure = (error) => {
    return {
        type: actions.BEATS_FAILURE,
        payload: error
    };
};

const beatsFilterSet = (payload) => {
    return {
        type: actions.BEATS_FILTER_SET,
        payload: payload
    }
}

const beatsInfoRequested = () => {
    return {
        type: actions.BEATS_INFO_REQUESTED,
    }
}

const beatsInfoSuccess = (payload) => {
    return {
        type: actions.BEATS_INFO_SUCCESS,
        payload: payload
    }
}

const beatsInfoFailure = (error) => {
    return {
        type: actions.BEATS_INFO_FAILURE,
        payload: error
    }
}

const beatsDropped = () => {
    return {
        type: actions.BEATS_DROPPED
    }
}

const filterRequest = () => {
    return {
        type: actions.FILTER_REQUESTED,
    }
}

const filterSuccess = (payload) => {
    return {
        type: actions.FILTER_SUCCESS,
        payload: payload
    }
}

const filterSearchSet = (search) => {
    return {
        type: actions.FILTER_SEARCH_SET,
        payload: search
    }
}

const filterDropped = () => {
    return {
        type: actions.FILTER_DROPPED,
    }
}

const filterFailure = (error) => {
    return {
        type: actions.FILTER_FAILURE,
        payload: error
    }
}

const audioToggle = (id) => {
    return {
        type: actions.AUDIO_TOGGLE,
        payload: id
    }
}

const audioPlayed = () => {
    return {
        type: actions.AUDIO_PLAYED,
    };
};

const audioLoaded = (id) => {
    return {
        type: actions.AUDIO_LOADED,
        payload: id
    };
}

const audioStopped = () => {
    return {
        type: actions.AUDIO_STOPPED,
    };
};

const signupRequested = () => {
    return {
        type: actions.SIGN_UP_REQUESTED
    };
};

const signupSuccess = (payload) => {
    return {
        type: actions.SIGN_UP_SUCCESS,
        payload: payload
    };
};

const signupFailure = (payload) => {
    return {
        type: actions.SIGN_UP_FAILURE,
        payload: payload
    };
};

const logInRequested = () => {
    return {
        type: actions.LOG_IN_REQUESTED
    }
}

const logInSuccess = (payload) => {
    return {
        type: actions.LOG_IN_SUCCESS,
        payload: payload
    }
}

const logInFailure = (payload) => {
    return {
        type: actions.LOG_IN_FAILURE,
        payload: payload
    }
}

const googleContinueRequested = () => {
    return {type: actions.GOOGLE_CONTINUE_REQUESTED}
};

const googleContinueSuccess = (user) => {
    return {type: actions.GOOGLE_CONTINUE_SUCCESS, payload: user}
};

const googleContinueFailed = (err) => {
    return {type: actions.GOOGLE_CONTINUE_FAILED, payload: err}
};

const userUpdateRequested = () => {
    return {
        type: actions.USER_UPDATE_REQUESTED
    }
}

const userUpdateSuccess = (userData) => {
    return {
        type: actions.USER_UPDATED_SUCCESS,
        payload: userData
    }
}

const userUpdateFailure = (error) => {
    return {
        type: actions.USER_UPDATE_FAILURE,
        payload: error
    }
}

const notificationClosed = () => {
    return {
        type: actions.NOTIFICATION_CLOSED
    }
}

const appendToCartRequested = () => {
    return {
        type: actions.APPEND_TO_CART_REQUESTED
    }
}

const appendToCartSuccess = (product) => {
    return {
        type: actions.APPEND_TO_CART_SUCCESS,
        payload: product
    }
}

const appendToCartFailure = (error) => {
    return {
        type: actions.APPEND_TO_CART_FAILURE,
        payload: error
    }
}
const removeFromCartRequested = () => {
    return {
        type: actions.REMOVE_FROM_CART_REQUESTED
    }
}

const removeFromCartSuccess = (cart) => {
    return {
        type: actions.REMOVE_FROM_CART_SUCCESS,
        payload: cart
    }
}

const removeFromCartFailure = (error) => {
    return {
        type: actions.REMOVE_FROM_CART_FAILURE,
        payload: error
    }
}

const licensesRequested = () => {
    return {
        type: actions.LICENSES_REQUESTED
    }
}

const licensesSuccess = (payload) => {
    return {
        type: actions.LICENSES_SUCCESS,
        payload
    }
}

const licensesFailure = (error) => {
    return {
        type: actions.LICENSES_FAILURE,
        payload: error
    }
}

const logoutRequested = () => {
    return {
        type: actions.LOGGED_OUT_REQUESTED
    }
}

const logoutSuccess = () => {
    return {
        type: actions.LOGGED_OUT_SUCCESS
    }
}

const logoutFailed = (error) => {
    return {
        type: actions.LOGGED_OUT_FAILED,
        payload: error
    }
}

const refreshTokenRequested = () => {
    return {
        type: actions.REFRESH_TOKEN_REQUESTED
    }
}

const refreshTokenSuccess = (accessToken) => {
    return {
        type: actions.REFRESH_TOKEN_SUCCESS,
        payload: accessToken
    }
}

const refreshTokenFailed = (err) => {
    return {
        type: actions.REFRESH_TOKEN_FAILED,
        payload: err
    }
}

const userErrorCleared = () => {
    return {
        type: actions.USER_ERROR_CLEARED
    }
}

const userDataFetchSuccessful = (data) => {
    return {
        type: actions.USER_DATA_FETCH_SUCCESSFUL,
        payload: data
    }
}

const userDataFetchFailed = (err) => {
    return {
        type: actions.USER_DATA_FETCH_FAILED,
        payload: err
    }
}

const confirmationRequested = () => {
    return {type: actions.CONFIRMATION_REQUESTED}
}

const confirmationSuccess = (userData) => {
    return {
        type: actions.CONFIRMATION_SUCCESS,
        payload: userData
    }
}

const confirmationFailed = (err) => {
    return {
        type: actions.CONFIRMATION_FAILED,
        payload: err
    }
}

const confirmationErrorRemoved = () => {
    return {type: actions.CONFIRMATION_ERROR_REMOVED}
};

const cartCleared = () => {
    return {type: actions.CART_CLEARED}
};


const paymentAccepted = () => {
    return {type: actions.PAYMENT_ACCEPTED}
};

const paymentAcceptanceDrop = () => {
    return {type: actions.PAYMENT_ACCEPTANCE_DROP}
};

const paymentDeclined = (err) => {
    return {type: actions.PAYMENT_DECLINED, payload: err}
};

const paymentDeclineDrop = () => {
    return {type: actions.PAYMENT_DECLINE_DROP}
}

const paymentRequested = () => {
    return {type: actions.PAYMENT_REQUESTED}
};

const paymentCanceled = () => {
    return {type: actions.PAYMENT_CANCELED}
};

const userPurchasesUpdateSuccessful = (purchases) => {
    return {type: actions.USER_PURCHASES_UPDATE_SUCCESSFUL, payload: purchases}
};

const userPurchasesUpdateFailed = (err) => {
    return {type: actions.USER_PURCHASES_UPDATE_FAILED, payload: err}
};

const paymentDeclinedAndRedirected = (err, history) => (dispatch, getState) => {
    dispatch(paymentDeclined(JSON.stringify({...err?.response?.data, statusText: err.message})));
    history.replace('checkout/failed');
}
const paymentAcceptedAndRedirected = (history) => async (dispatch, getState) => {
    const {loggedIn, id, token} = getState().userReducer;

    if (loggedIn) {
        try {
            const response = await authService.getUserPurchasesById(id, token);
            dispatch(userPurchasesUpdateSuccessful(response.data.purchases))
        }
        catch (e) {
            console.log(e);
            console.log(e.response?.data);
            dispatch(userPurchasesUpdateFailed(e));
        }
    }

    dispatch(paymentAccepted());
    dispatch(cartCleared());
    history.replace('checkout/success');
}



const signup = (formState) => async (dispatch, getState) => {
    dispatch(signupRequested());
    const {email, username, password} = formState.inputs;

    try {
        const response = await authService.signup({
            email: email.value,
            username: username.value,
            password: password.value,
            clientIP: 'http://localhost:3000/confirmation'
        });

        // const tokenExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60);

        dispatch(signupSuccess());

        // localStorage.setItem('userData', JSON.stringify({
        //     ...response.data.user,
        //     expiration: tokenExpirationDate.toISOString()
        // }));
        // localStorage.removeItem('cartData');

        console.log(response.data);
    } catch (e) {
        console.log(e.response.data);
        dispatch(signupFailure(e.response.data));
    }
}

const login = (formState, userDataLocalStorage) => async (dispatch, getState) => {
    dispatch(logInRequested());

    if (!formState) {
        const tokenExpirationDate = new Date(userDataLocalStorage.expiration) || new Date(new Date().getTime() + 1000 * 60 * 60);


        let user;
        try {
            const response = await authService.getUserDataById(userDataLocalStorage.id, userDataLocalStorage.token);
            user = response.data.user;
        }
        catch (e) {
            dispatch(logInFailure(e.response.data));
        }

        dispatch(logInSuccess({
            ...userDataLocalStorage,
            cart: user.cart,
            purchased: user.purchased,
            expiration: tokenExpirationDate
        }));

        localStorage.setItem('userData', JSON.stringify({
            ...userDataLocalStorage,
            cart: user.cart,
            expiration: tokenExpirationDate.toISOString()
        }));
        localStorage.removeItem('cartData');

        return;
    }

    const {email, password} = formState;

    try {
        const response = await authService.login({
            email: email.value,
            password: password.value
        });

        const tokenExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60);

        dispatch(logInSuccess({
            ...response.data.user,
            expiration: tokenExpirationDate.toISOString()
        }));

        localStorage.setItem('userData', JSON.stringify({
            ...response.data.user,
            expiration: tokenExpirationDate.toISOString()
        }));
        localStorage.removeItem('cartData');
    } catch (e) {
        console.log(e.response)
        dispatch(logInFailure(e.response.data))
    }
}

const fetchBeats = (limit) => async (dispatch, getState) => {
    dispatch(beatsRequested());

    const skip = getState().beatsReducer.skip;
    const filter = getState().beatsReducer.filter;

    // console.log(filter);
    try {
        const response = await beatstoreService.getBeats(skip, limit, filter);
        dispatch(beatsLoaded({beats: response.data.beats, limit}));
    } catch (e) {
        console.log(e.response);
        dispatch(beatsFailure(e.response.data))
    }
}

const fetchInfo = () => async (dispatch, getState) => {
    dispatch(beatsInfoRequested());

    try {
        const response = await beatstoreService.getInfo();
        dispatch(beatsInfoSuccess(response.data.info));
    } catch (e) {
        console.log(e.response);
        dispatch(beatsInfoFailure(e.response.data))
    }
}

const filter = (formState, limit) => async (dispatch, getState) => {
    dispatch(filterRequest());

    const currentFilterSearch = getState().beatsReducer.filter.search;

    let currentFormState;
    if (!formState) {
        currentFormState = getState().beatsReducer.filter;
        // console.log(currentFormState)
    } else {
        currentFormState = formState;
    }

    const filter = {
        ...currentFormState,
        search: currentFilterSearch
    }

    try {
        const response = await beatstoreService.getBeats(0, limit, filter);
        dispatch(filterSuccess({
            beats: response.data.beats,
            limit,
            filter
        }));
    } catch (e) {
        console.log(e.response);
        dispatch(filterFailure(e.response.data))
    }
}

const logOut = () => async (dispatch, getState) => {
    dispatch(logoutRequested());
    const {token} = getState().userReducer;

    try {
        const response = await authService.logout(token);
        dispatch(logoutSuccess());
    } catch (e) {
        console.log(e.response.data);
        dispatch(logoutFailed(e.response.data));
    } finally {
        localStorage.removeItem('userData');
        localStorage.removeItem('cartData');
    }
}

const updateUser = (id, userData) => async (dispatch, getState) => {
    dispatch(userUpdateRequested());


    const {expiration, token} = getState().userReducer;

    try {
        const response = await authService.updateUser(id, userData, token);
        localStorage.setItem('userData', JSON.stringify({
            ...response.data.user,
            expiration
        }));
        dispatch(userUpdateSuccess(response.data.user));
    } catch (e) {
        console.log(e.response);
        dispatch(userUpdateFailure(e.response.data));
    }

}

const fetchLicenses = () => async (dispatch, getState) => {
    dispatch(licensesRequested());


    try {
        const response = await licensesService.getAllLicenses();
        dispatch(licensesSuccess(response.data.licenses));
    } catch (e) {
        console.log(e.response);
        dispatch(licensesFailure(e.response.data));
    }
}

const appendToCart = (product) => async (dispatch, getState) => {
    dispatch(appendToCartRequested());

    const {id, token, loggedIn, cart} = getState().userReducer;

    try {
        let response
        if (loggedIn) {
            response = await authService.appendToCart(id, product, token);
            localStorage.setItem('userData', JSON.stringify({
                ...getState().userReducer,
                cart: response.data.cart,
            }));
        }
        else {
            response = await authService.appendToCartOffline(product, cart);
            localStorage.setItem('cartData', JSON.stringify(response.data.cart));
        }
        dispatch(appendToCartSuccess(response.data.cart));
    } catch (e) {
        dispatch(appendToCartFailure(e.response.data));
    }
}

const removeFromCart = (productId) => async (dispatch, getState) => {
    dispatch(removeFromCartRequested());

    const {id, token, expiration, loggedIn, cart} = getState().userReducer;

    try {
        let response;
        if (loggedIn) {
            response = await authService.removeFromCart(id, productId, token);
            localStorage.setItem('userData', JSON.stringify({
                ...getState().userReducer,
                cart: response.data.cart,
            }));
        }
        else {
            response = await authService.removeFromCartOffline(productId, cart);
            localStorage.setItem('cartData', JSON.stringify(response.data.cart));
        }
        dispatch(removeFromCartSuccess(response.data.cart));
    } catch (e) {
        dispatch(removeFromCartFailure(e.response.data));
    }

}

const googleContinue = (tokenId) => async (dispatch, getState) => {

    dispatch(googleContinueRequested());
    try {
        const response = await authService.googleContinue(tokenId);

        const tokenExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60);

        dispatch(googleContinueSuccess({
            ...response.data.user,
            expiration: tokenExpirationDate.toISOString()
        }));

        localStorage.setItem('userData', JSON.stringify({
            ...response.data.user,
            expiration: tokenExpirationDate.toISOString()
        }));
        localStorage.removeItem('cartData');

    } catch (e) {
        console.log(e.message);
        dispatch(googleContinueFailed(e.response.data));
    }
}

const refreshToken = (refreshToken) => async (dispatch, getState) => {
    dispatch(refreshTokenRequested());
    const userState = getState().userReducer;
    try {
        const response = await authService.refreshToken(refreshToken);
        const tokenExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60);
        dispatch(refreshTokenSuccess({
            accessToken: response.data.accessToken,
            expiration: tokenExpirationDate
        }));

        localStorage.setItem('userData', JSON.stringify({
            ...userState,
            token: response.data.accessToken,
            expiration: tokenExpirationDate
        }));
    } catch (e) {
        console.log(e.response.data);
        dispatch(refreshTokenFailed(e.response.data));
    }
}

const confirmUser = (confirmationCode) => async (dispatch, getState) => {
    dispatch(confirmationRequested());

    try {
        const response = await authService.verify(confirmationCode);

        const tokenExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60);

        dispatch(confirmationSuccess({
            ...response.data.user,
            expiration: tokenExpirationDate
        }));

        localStorage.setItem('userData', JSON.stringify({
            ...response.data.user,
            expiration: tokenExpirationDate.toISOString()
        }));

        localStorage.removeItem('cartData');

        console.log(response.data);
    }
    catch (e) {
        console.log(e);
        dispatch(confirmationFailed(e.response.data));
    }

}

export {
    fetchBeats,
    fetchInfo,
    filter,
    filterSearchSet,
    filterDropped,
    beatsDropped,

    audioPlayed,
    audioStopped,
    audioLoaded,
    audioToggle,

    login,
    signup,
    logInSuccess,
    updateUser,
    appendToCart,
    removeFromCart,
    notificationClosed,
    googleContinue,
    googleContinueFailed,
    refreshToken,
    logOut,
    userErrorCleared,
    userDataFetchFailed,
    userDataFetchSuccessful,
    confirmUser,
    confirmationErrorRemoved,

    fetchLicenses,
    cartCleared,
    paymentAcceptedAndRedirected,
    paymentAcceptanceDrop,
    paymentDeclinedAndRedirected,
    paymentDeclineDrop,
    paymentRequested,
    paymentCanceled
};