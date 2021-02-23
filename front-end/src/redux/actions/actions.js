import * as actions from '../../constants/redux-action-names';
import AuthService from "../../services/auth-service";
import BeatstoreService from "../../services";

const beatstoreService = new BeatstoreService();
const authService = new AuthService();

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

const loggedOut = () => {
    return {
        type: actions.LOGGED_OUT,
    };
};

const signup = (formState) => async (dispatch, getState) => {
    dispatch(signupRequested());
    const {email, username, password} = formState.inputs;

    try {
        const response = await authService.signup({
            email: email.value,
            username: username.value,
            password: password.value
        });

        const tokenExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60);

        dispatch(signupSuccess({
            ...response.data.user,
            expiration: tokenExpirationDate
        }));

        localStorage.setItem('userData', JSON.stringify({
            ...response.data.user,
            expiration: tokenExpirationDate.toISOString()
        }));

        console.log(response.data);
    } catch (e) {
        dispatch(signupFailure(e.response.data));
    }
}

const login = (formState, userData) => async (dispatch, getState) => {
    dispatch(logInRequested());

    if (!formState) {
        const tokenExpirationDate = new Date(userData.expiration) || new Date(new Date().getTime() + 1000 * 60 * 60);
        dispatch(logInSuccess({
            ...userData,
            expiration: tokenExpirationDate
        }));

        localStorage.setItem('userData', JSON.stringify({
            ...userData,
            expiration: tokenExpirationDate.toISOString()
        }));
        return;

    }

    const {email, password} = formState;

    try {
        const response = await authService.login({
            email: email.value,
            password: password.value
        });

        const tokenExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60);
        console.log('IN ACTIONS', tokenExpirationDate);

        dispatch(logInSuccess({
            ...response.data.user,
            expiration: tokenExpirationDate.toISOString()
        }));

        localStorage.setItem('userData', JSON.stringify({
            ...response.data.user,
            expiration: tokenExpirationDate.toISOString()
        }));

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
    }
    else {
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

const logOut = () => (dispatch, getState) => {
    dispatch(loggedOut());
    localStorage.removeItem('userData');
}

// const fetchLatestBeats = () => async (dispatch, getState) => {
//
//     dispatch(beatsRequested());
//
//     try {
//         const response = await beatstoreService.getLatestBeats();
//         dispatch(latestBeatsLoaded(response.data.beats));
//     }
//     catch (e) {
//         console.log(e.response);
//         dispatch(beatsFailure(e.response.data));
//     }
// }

export {
    fetchBeats,
    fetchInfo,
    filter,
    filterSearchSet,
    filterDropped,
    beatsDropped,

    audioPlayed,
    audioStopped,
    // audioLengthLoaded,
    // audioLengthPlayed,
    audioLoaded,
    audioToggle,

    login,
    signup,
    logOut,
    logInSuccess
};