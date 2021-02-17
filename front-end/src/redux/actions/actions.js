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

const filterFailure = (error) => {
    return {
        type: actions.FILTER_FAILURE,
        payload: error
    }
}

const audioPlayed = () => {
    return {
        type: actions.AUDIO_PLAYED,
    };
};

const audioLoaded = (url) => {
    return {
        type: actions.AUDIO_LOADED,
        payload: url
    };
}

const audioLengthLoaded = (loaded) => {
    return {
        type: actions.AUDIO_LENGTH_LOADED,
        payload: loaded
    };
}

const audioLengthPlayed = (played) => {
    return {
        type: actions.AUDIO_LENGTH_PLAYED,
        payload: played
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
        dispatch(signupSuccess(response.data));
        console.log(response.data);
    } catch (e) {
        dispatch(signupFailure(e.response.data));
    }
}

const login = (formState) => async (dispatch, getState) => {
    dispatch(logInRequested());

    const {email, password} = formState;

    try {
        const response = await authService.login({
            email: email.value,
            password: password.value
        });
        dispatch(logInSuccess(response.data));
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
    try {
        const response = await beatstoreService.getBeats(0, limit, {
            ...formState,
            search: currentFilterSearch
        });
        dispatch(filterSuccess({
            beats: response.data.beats,
            limit,
            filter: formState,
        }));
    } catch (e) {
        console.log(e.response);
        dispatch(filterFailure(e.response.data))
    }
}

export {
    fetchBeats,
    fetchInfo,
    filter,

    audioPlayed,
    audioStopped,
    audioLengthLoaded,
    audioLengthPlayed,
    audioLoaded,

    login,
    signup,
    loggedOut
};