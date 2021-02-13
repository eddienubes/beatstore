import React from 'react';
import TracksTable from "../../components/tracks-table/tracks-table";
import Footer from "../../components/footer";
import AudioSpectrum2 from "../../components/audio-spectrum";
import Filter from "../../components/filter";

const BeatsPage = () => {

    return (
        <>
            <Filter/>
            {/*<AudioSpectrum2/>*/}
            <TracksTable isMain={false}/>
        </>
        // <AudioSpectrumContainer/>

    );
};

export default BeatsPage;