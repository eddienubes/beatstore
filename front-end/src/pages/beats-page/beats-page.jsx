import React from 'react';
import TracksTable from "../../components/tracks-table/tracks-table";
import Footer from "../../components/footer";
import AudioSpectrum2 from "../../components/audio-spectrum";
import Filter from "../../components/filter";
import {useParams} from "react-router";
import CurrentTrack from "../../components/current-track";

const BeatsPage = () => {
    return (
        <>
            <Filter/>
            <CurrentTrack/>
            <TracksTable isMain={false}/>
        </>
        // <AudioSpectrumContainer/>

    );
};

export default BeatsPage;