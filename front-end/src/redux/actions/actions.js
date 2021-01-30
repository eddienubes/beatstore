import * as actions from '../../constants/redux-action-names';

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

const beatsError = (error) => {
    return {
        type: actions.BEATS_ERROR,
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

const setAudioInstance = (payload) => {
    return {
        type: actions.SET_AUDIO_INSTANCE,
        payload: payload
    };
}
export {
    beatsRequested,
    beatsLoaded,
    beatsError,

    audioPlayed,
    audioStopped,
    setAudioInstance
};