import React, {useContext} from 'react';
import ReactJkMusicPlayer from "react-jinke-music-player";
import BeatstoreService from "../beatstore-service-context";
import 'react-jinke-music-player/assets/index.css';
import 'react-jinke-music-player/lib/styles/index.less'

const MusicPlayer = () => {
    const {getBeats} = useContext(BeatstoreService);
    const beatList = getBeats();

    return (
        <ReactJkMusicPlayer
            // onAudioPause={() => {
            //     setSelectedTrack(null);
            // }}
            mode={"full"}
            autoPlay={false}
            audioLists={beatList.map((track) => {
                return ({
                name: track.name,
                musicSrc: track.audioUrl,
                cover: track.imgUrl
            })
            })}
            getAudioInstance={(instance) => {
                // setAudioInstance(instance);
            }}/>
    );
};

export default MusicPlayer;