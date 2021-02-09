import React, {useContext, useEffect} from 'react';
import 'react-jinke-music-player/assets/index.css';
import 'react-jinke-music-player/lib/styles/index.less'
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {fetchBeats, audioPlayed, audioStopped} from "../../redux/actions";
import ReactJkMusicPlayer from "react-jinke-music-player";
import AudioInstanceContext from "../audio-instance-context";

import './music-player.scss';
import BeatstoreService from "../../services";

function Duration({className, seconds}) {
    return (
        <time dateTime={`P${Math.round(seconds)}S`} className={className}>
            {format(seconds)}
        </time>
    )
}

function format(seconds) {
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = pad(date.getUTCSeconds())
    if (hh) {
        return `${hh}:${pad(mm)}:${ss}`
    }
    return `${mm}:${ss}`
}

function pad(string) {
    return ('0' + string).slice(-2)
}

const MusicPlayer = () => {
    const dispatch = useDispatch();
    const {beatList} = useSelector(state => state.beatsReducer);
    const audio = useContext(AudioInstanceContext);

    useEffect(() => {
        dispatch(fetchBeats(0));
    }, []);
    return (
        <ReactJkMusicPlayer
            onAudioPlay={({id}) => {
                dispatch(audioPlayed(id));
            }}
            onAudioPause={() => dispatch(audioStopped())}
            mode={"full"}
            autoPlay={false}

            audioLists={
                beatList.map((track) => {
                    const baseUrl = 'http://localhost:5000/api/';
                    const audioUrl = baseUrl + track.previewAudioUrl.replaceAll('\\', '/');
                    const imgUrl = baseUrl + track.imgUrl.replaceAll('\\', '/');

                    return ({
                        id: track.id,
                        name: track.title,
                        musicSrc: audioUrl,
                        cover: imgUrl
                    });
                })}
            getAudioInstance={instance => {
                audio.updateValue.setAudioInstance(instance);
            }}
        />

    );


    // loadFile = async () => {
    //     const response = await axios.get('http://localhost:5000/beat', {
    //         responseType: 'blob',
    //         headers: {
    //             'Content-Type': 'audio/mp3',
    //         },
    //     });
    //     const blob = new Blob([response.data], {type: 'audio/mp3'});
    //     const url = URL.createObjectURL(blob);
    //     if (!this.state.url) {
    //         this.load(url);
    //     }
    // }


}

export default MusicPlayer;