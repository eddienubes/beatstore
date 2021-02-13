import React, {useContext, useState} from 'react';
import 'react-jinke-music-player/assets/index.css';
import 'react-jinke-music-player/lib/styles/index.less'
import {useDispatch, useSelector} from "react-redux";
import {audioPlayed, audioStopped} from "../../redux/actions";
import ReactJkMusicPlayer from "react-jinke-music-player";
import AudioInstanceContext from "../audio-instance-context";

import './music-player.scss';

const MusicPlayer = () => {
    const [audioInstance, setAudioInstance] = useState(null);
    const dispatch = useDispatch();
    const {beatsReducer, audioReducer} = useSelector(state => state);
    const audio = useContext(AudioInstanceContext);

    const {beatList} = beatsReducer;
    const {id, isPlaying, previousId} = audioReducer;

    // useEffect(() => {
    //     if (!audioInstance) return;
    //
    //     if (id !== previousId) {
    //         audioInstance.playByIndex(id - 1);
    //         return;
    //     }
    //
    //     if (id === previousId) {
    //         audioInstance.play();
    //     }
    // }, [id, isPlaying, audioInstance])

    if (beatList.length === 0) {
        return null;
    }
    return (
        <ReactJkMusicPlayer
            showMiniProcessBar={true}
            onAudioPlay={({id}) => {
                dispatch(audioPlayed(id));
            }}
            onAudioPause={() => {
                dispatch(audioStopped())
            }}
            mode={"full"}
            autoPlay={false}
            glassBg={true}
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
                setAudioInstance(instance);
                instance.crossOrigin = "anonymous";
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