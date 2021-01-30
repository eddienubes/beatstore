import React, {useContext, useEffect} from 'react';
import {useSelector} from "react-redux";
import AudioSpectrum from "../../components/audio-spectrum";
import AudioInstanceContext from "../../components/audio-instance-context";

import './audio-spectrum-container.scss';

const AudioSpectrumContainer = (props) => {
    let analyser = null;
    let source = null;
    const frequencyBandArray = [...Array(25).keys()];

    const {id, isPlaying} = useSelector(state => state.audioReducer);
    const audio = useContext(AudioInstanceContext);


    const initializeAudioAnalyser = () => {

        const audioFile = audio.state;
        const audioContext = new AudioContext();
        source = audioContext.createMediaElementSource(audioFile);
        source.disconnect(audioFile);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        source.connect(audioContext.destination);
        source.connect(analyser);
        // audioContext.close();
        // create class sound with all fields but source will be defined when constructing // TODO
    };

    const getFrequencyData = (styleAdjuster) => {
        const bufferLength = analyser.frequencyBinCount;
        const amplitudeArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(amplitudeArray)
        styleAdjuster(amplitudeArray)
    };

    return (
        <div>
            <AudioSpectrum
                initializeAudioAnalyser={initializeAudioAnalyser}
                frequencyBandArray={frequencyBandArray}
                getFrequencyData={getFrequencyData}
                isPlaying={isPlaying}
            />
        </div>
    );
};

export default AudioSpectrumContainer;