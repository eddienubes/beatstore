import React, { useState } from 'react';

const withPlayables = (Wrapped) => {
  let audioInstance = null;
  const setInstance = (instance) => {
    audioInstance = instance;
  };

  // const audio = useSelector(state => state.audio);
  // const setSelectedTrack = useCallback((payload) =>
  //         dispatch(actions.setSelectedTrack(payload)),
  //     [track]);
  //
  //
  // const setPreviousTrack = useCallback((payload) =>
  //         dispatch(actions.setPreviousTrack(payload)),
  //     [track]);

  const playBack = () => {
    // if (audio.selectedTrack === track.id) {
    //     setSelectedTrack(null);
    //     setPreviousTrack(track.id);
    //
    // } else {
    //     setSelectedTrack(track.id);
    //     setPreviousTrack(audio.selectedTrack);
    // }
    //
    // audio.audioInstance.play();
  };

  return function (props) {
    return <Wrapped {...props} playBack={playBack} audio={audioInstance} setAudio={setInstance} />;
  };
};

export default withPlayables;
