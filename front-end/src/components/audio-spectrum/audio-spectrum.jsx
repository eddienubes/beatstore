import React, {useRef} from 'react';
import {makeStyles, Paper} from "@material-ui/core";

import './audio-spectrum.scss';

const useStyles = makeStyles(theme => ({
    flexContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingTop: '25%'
    }
}));

const AudioSpectrum = ({frequencyBandArray, getFrequencyData, initializeAudioAnalyser, isPlaying}) => {
    const classes = useStyles();
    const amplitudeValues = useRef(null);

    const adjustFreqBandStyle = (newAmplitudeData) => {
        amplitudeValues.current = newAmplitudeData;
        let domElements = frequencyBandArray.map(num => document.getElementById('paper' + num));

        for (let i = 0; i < frequencyBandArray.length; i++) {

            let num = frequencyBandArray[i];
            domElements[num].style.backgroundColor = `rgb(0, 255, ${amplitudeValues.current[num]})`;
            domElements[num].style.height = `${amplitudeValues.current[num]}px`;
        }
    };

    const runSpectrum = () => {
        if (!isPlaying) {
            return;
        }
        getFrequencyData(adjustFreqBandStyle);
        requestAnimationFrame(runSpectrum);
    };

    const startButtonHandler = () => {
        initializeAudioAnalyser();

        requestAnimationFrame(runSpectrum);
    };

    // cancelAnimationFrame TODO
    if (isPlaying) {
        startButtonHandler();
    }

    return (

        <div className={classes.flexContainer}>
            {
                frequencyBandArray.map((num) =>
                    <Paper
                        className={"frequency-bands"}
                        elevation={4}
                        id={'paper' + num}
                        key={num}
                    />
                )
            }
        </div>


    );
};

export default AudioSpectrum;