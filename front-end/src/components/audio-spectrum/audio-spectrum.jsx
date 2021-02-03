import React, {Component, createRef, useRef} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import './audio-spectrum.scss';
import {connect, useSelector} from "react-redux";
import {withAudioInstance} from "../hoc";

const useStyles = makeStyles(theme => ({
    flexContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingTop: '25%'
    }
}));

// const AudioSpectrum = (props) => {
//
//     const classes = useStyles();
//
//     const amplitudeValues = useRef(null);
//
//     function adjustFreqBandStyle(newAmplitudeData) {
//         amplitudeValues.current = newAmplitudeData;
//         let domElements = props.frequencyBandArray.map((num) =>
//             document.getElementById(num));
//         for (let i = 0; i < props.frequencyBandArray.length; i++) {
//             let num = props.frequencyBandArray[i]
//             domElements[num].style.backgroundColor = `rgb(0, 255, ${amplitudeValues.current[num]})`
//             domElements[num].style.height = `${amplitudeValues.current[num]}px`
//         }
//     }
//
//     function runSpectrum() {
//         props.getFrequencyData(adjustFreqBandStyle)
//         requestAnimationFrame(runSpectrum)
//     }
//
//     function handleStartButtonClick() {
//         // props.initializeAudioAnalyser()
//         requestAnimationFrame(runSpectrum)
//     }
//
//     if (props.isPlaying) {
//         handleStartButtonClick();
//     }
//
//     return (
//
//         <div>
//             <div className={classes.flexContainer}>
//                 {props.frequencyBandArray.map((num) =>
//                     <Paper
//                         className={'frequencyBands'}
//                         elevation={4}
//                         id={num}
//                         key={num}
//                     />
//                 )}
//             </div>
//         </div>
//
//     );
// };
//
// export default AudioSpectrum;
let ctx, x_end, y_end, bar_height;

// constants
const width = window.innerWidth;
const height = window.innerHeight;
const bars = 555;
const bar_width = 1;
const radius = 0;
const center_x = width / 2;
const center_y = height / 2;

class AudioSpectrum extends Component {
    constructor(props) {
        super(props)
        this.audio = this.props.instance;
        this.canvas = createRef();
    }

    animationLooper(canvas) {
        canvas.width = width;
        canvas.height = height;

        ctx = canvas.getContext("2d");

        for (var i = 0; i < bars; i++) {
            //divide a circle into equal part
            const rads = Math.PI * 2 / bars;

            // Math is magical
            bar_height = this.frequency_array[i] * 2;

            const x = center_x + Math.cos(rads * i) * (radius);
            const y = center_y + Math.sin(rads * i) * (radius);
            x_end = center_x + Math.cos(rads * i) * (radius + bar_height);
            y_end = center_y + Math.sin(rads * i) * (radius + bar_height);

            //draw a bar
            this.drawBar(x, y, x_end, y_end, this.frequency_array[i], ctx, canvas);
        }
    }

    drawBar(x1=0, y1=0, x2=0, y2=0, frequency, ctx, canvas) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "rgba(35, 7, 77, 1)");
        gradient.addColorStop(1, "rgb(204,83,51)");
        ctx.fillStyle = gradient;

        const lineColor = "rgb(" + frequency + ", " + frequency + ", " + 205 + ")";
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = bar_width;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    componentDidMount() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        console.log(this.props.sourceSet);

        if (!this.props.sourceSet) {
            console.log('HER');
            this.source = this.context.createMediaElementSource(this.audio);
            this.props.setSource(true);
        }
        this.analyser = this.context.createAnalyser();
        this.source.connect(this.analyser);
        this.analyser.connect(this.context.destination);
        this.frequency_array = new Uint8Array(this.analyser.frequencyBinCount);


    }

    togglePlay = (isPlaying) => {
        const { audio } = this;
        if (isPlaying) {
            this.rafId = requestAnimationFrame(this.tick);
        } else {
            cancelAnimationFrame(this.rafId);
        }
    }

    tick = () => {
        this.animationLooper(this.canvas.current);
        this.analyser.getByteTimeDomainData(this.frequency_array);
        this.rafId = requestAnimationFrame(this.tick);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rafId);
        this.analyser.disconnect();
        this.source.disconnect();
    }

    render() {

        this.togglePlay(this.props.isPlaying);

        return <>
            <canvas ref={this.canvas}  />
        </>
    }
}

const mapStateToProps = ({audioReducer}) => {
    return {
        isPlaying: audioReducer.isPlaying,
    }
}

export default connect(mapStateToProps)(AudioSpectrum);