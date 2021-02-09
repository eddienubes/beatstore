import * as actions from '../../constants/redux-action-names';
import AuthService from "../../services/auth-service";
import BeatstoreService from "../../services";
import axios from "axios";

const beatstoreService = new BeatstoreService();
const authService = new AuthService();

const beatsRequested = () => {
    return {
        type: actions.BEATS_REQUESTED,
    };
};

const beatsLoaded = (newBeats) => {
    return {
        type: actions.BEATS_LOADED,
        payload: newBeats
    };
};

const beatsFailure = (error) => {
    return {
        type: actions.BEATS_FAILURE,
        payload: error
    };
};

const audioPlayed = (audio) => {
    return {
        type: actions.AUDIO_PLAYED,
        payload: audio
    };
};

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
    }
    catch (e) {
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
    }
    catch (e) {
        console.log(e.response)
        dispatch(logInFailure(e.response.data))
    }
}

const fetchBeats = (skip) => async (dispatch, getState) => {
    dispatch(beatsRequested());
    try {
        const response = await beatstoreService.getBeats(skip);
        dispatch(beatsLoaded(response.data.beats));
    }
    catch (e) {
        console.log(e.response);
        dispatch(beatsFailure(e.response.data))
    }
}

export {
    fetchBeats,

    audioPlayed,
    audioStopped,

    login,
    signup,
    loggedOut
};