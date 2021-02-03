import React, {useContext} from "react";
import AudioInstanceContext from "../audio-instance-context";
import {useSelector} from "react-redux";

const withAudioInstance = (Wrapped) => {

    return (props) => {
        const instance = useContext(AudioInstanceContext).state;
        const {isPlaying} = useSelector(state => state.audioReducer);
        return (
            <Wrapped {...props} instance={instance} isPlaying={isPlaying}/>
        );
    };
};

export default withAudioInstance;