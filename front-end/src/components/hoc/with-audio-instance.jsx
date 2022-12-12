import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import AudioInstanceContext from '../audio-instance-context';

const withAudioInstance = (Wrapped) =>
  function (props) {
    const instance = useContext(AudioInstanceContext).state;
    const { isPlaying } = useSelector((state) => state.audioReducer);
    return <Wrapped {...props} instance={instance} isPlaying={isPlaying} />;
  };

export default withAudioInstance;
