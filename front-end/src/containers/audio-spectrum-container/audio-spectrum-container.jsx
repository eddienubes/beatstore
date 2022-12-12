import React, { Component, createRef, useContext, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import AudioSpectrum from '../../components/audio-spectrum';
import { withAudioInstance } from '../../components/hoc';

import './audio-spectrum-container.scss';
import AudioInstanceContext from '../../components/audio-instance-context';

function AudioSpectrumContainer() {
  const { audioInstance, sourceSet } = useContext(AudioInstanceContext).state;
  const { setSource } = useContext(AudioInstanceContext).updateValue;
  const { isPlaying } = useSelector((state) => state.audioReducer);

  if (audioInstance) {
    console.log('asdasdasd');
    return (
      <AudioSpectrum instance={audioInstance} isPlaying={isPlaying} sourceSet={sourceSet} setSource={(bool) => setSource(bool)} />
    );
  }
  return null;
}

export default AudioSpectrumContainer;
