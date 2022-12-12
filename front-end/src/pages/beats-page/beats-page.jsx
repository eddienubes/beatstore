import React from 'react';
import { useParams } from 'react-router';
import TracksTable from '../../components/tracks-table/tracks-table';
import Footer from '../../components/footer';
import AudioSpectrum2 from '../../components/audio-spectrum';
import Filter from '../../components/filter';
import CurrentTrack from '../../components/current-track';

function BeatsPage() {
  return (
    <>
      <Filter />
      <TracksTable isMain={false} />
    </>
    // <AudioSpectrumContainer/>
  );
}

export default BeatsPage;
