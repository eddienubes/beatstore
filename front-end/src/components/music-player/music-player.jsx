import React, {useContext, useEffect} from 'react';
import ReactJkMusicPlayer from "react-jinke-music-player";
import 'react-jinke-music-player/assets/index.css';
import 'react-jinke-music-player/lib/styles/index.less'
import BeatstoreService from "../../services";
import {useDispatch, useSelector} from "react-redux";
import {audioPlayed, audioStopped, beatsLoaded} from '../../redux/actions';
import AudioInstanceContext from "../audio-instance-context";


const MusicPlayer = () => {
    const beatstoreService = new BeatstoreService();
    const dispatch = useDispatch();
    const {beatList} = useSelector(state => state.beatsReducer);
    const audio = useContext(AudioInstanceContext);

    useEffect(() => {
        const beatList = beatstoreService.getBeats();
        dispatch(beatsLoaded(beatList));
    }, []);

    return (
        <ReactJkMusicPlayer
            onAudioPlay={({id}) => {
                dispatch(audioPlayed(id));
            }}
            onAudioPause={() => dispatch(audioStopped())}
            // onAudioPlay={dispatch(audioPlayed())}
            // onAudioPause={() => {
            //     setSelectedTrack(null);
            // }}
            mode={"full"}
            autoPlay={false}

            audioLists={
                beatList.map((track) => {
                    return ({
                        id: track.id,
                        name: track.name,
                        musicSrc: track.audioUrl,
                        cover: track.imgUrl
                    });
                })}
            getAudioInstance={instance => {
                audio.updateValue.setAudioInstance(instance);
            }}
        />
    );
};

export default MusicPlayer;