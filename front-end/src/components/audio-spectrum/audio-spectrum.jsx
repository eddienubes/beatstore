import React, {useContext, useEffect, useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {useSelector} from "react-redux";

import './audio-spectrum.scss';
import AudioInstanceContext from "../audio-instance-context";
import Spinner from "../spinner";
import axios from "axios";

const useStyles = makeStyles(theme => ({
    flexContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingTop: '25%'
    }
}));


const AudioSpectrum2 = (props) => {

    const {state, updateValue} = useContext(AudioInstanceContext);
    const {isPlaying} = useSelector(state => state.audioReducer);
    const amplitudeValues = useRef(null);
    const classes = useStyles();
    const [audioData, setAudioData] = useState(null);
    const [animId, setAnimId] = useState(null);
    const frequencyBandArray = useRef([...Array(25).keys()]).current;

    const {audioInstance, source} = state;

    useEffect(() => {
        if (isPlaying && audioData) {
            handleStartButtonClick();
        }
        else {
            console.log('here');
            cancelAnimationFrame(animId);
        }

        return () => {
            cancelAnimationFrame(animId);
        }
    }, [isPlaying, audioData]);

    useEffect(() => {
        if (audioInstance) {
            initializeAudioAnalyser();
        }
    }, [audioInstance]);

    const initializeAudioAnalyser = async () => {
        const audioContext = new AudioContext();
        let newSource;
        if (!source) {
            newSource = audioContext.createBufferSource();
            updateValue.setSource(newSource);
        }
        else {
            newSource = source;
        }

        // let fileReader = new FileReader();
        // let arrayBuffer;
        //
        // fileReader.onloadend = () => {
        //     arrayBuffer = fileReader.result;
        // }

        const response = await axios.get(audioInstance.src, {
            responseType: 'blob'
        });
        const arrayBuffer = await new Blob([response.data], {type: 'audio/mp3'}).arrayBuffer();

        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // fileReader.readAsArrayBuffer(audioInstance.src);
        console.log(audioBuffer);
        newSource.buffer = audioBuffer;
        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 1024;

        newSource.connect(analyser);
        analyser.connect(audioContext.destination);
        setAudioData(analyser);
    }
    const getFrequencyData = (styleAdjuster) => {

        const bufferLength = audioData.frequencyBinCount;
        const amplitudeArray = new Uint8Array(bufferLength);
        audioData.getByteFrequencyData(amplitudeArray);
        styleAdjuster(amplitudeArray);

    }

    const adjustFreqBandStyle = (newAmplitudeData) => {
        console.log(newAmplitudeData);
        amplitudeValues.current = newAmplitudeData;
        let domElements = frequencyBandArray.map((num) =>
            document.getElementById(num));

        for (let i = 0; i < frequencyBandArray.length; i++) {
            let num = frequencyBandArray[i]
            domElements[num].style.backgroundColor = `rgb(0, 255, ${amplitudeValues.current[num]})`
            domElements[num].style.height = `${amplitudeValues.current[num]}px`
        }
    }

    const runSpectrum = () => {
        getFrequencyData(adjustFreqBandStyle)
        requestAnimationFrame(runSpectrum)
    }

    const handleStartButtonClick = () => {
        const animId = requestAnimationFrame(runSpectrum);
        setAnimId(animId);
    }



    if (!state.audioInstance) {
        return <Spinner/>
    }

    return (
        <div className={`${classes.flexContainer} animat`}>
            {frequencyBandArray.map((num) =>
                <Paper
                    className={'frequencyBands'}
                    elevation={4}
                    id={num}
                    key={num}
                />
            )}
        </div>
    );
}


export default AudioSpectrum2;