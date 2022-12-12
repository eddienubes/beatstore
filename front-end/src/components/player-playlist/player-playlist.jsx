import React, { useMemo } from 'react';
import { Table } from 'semantic-ui-react';
import PlayerPlaylistItem from '../player-playlist-item';

import './player-playlist.scss';

function PlayerPlaylist(props) {
  const tracks = useMemo(() => props.audioList.map((track) => <PlayerPlaylistItem />));

  return (
    <div className="player-playlist-wrapper">
      <Table structured unstackable>
        <Table.Body className="table-body-main">{tracks}</Table.Body>
      </Table>
    </div>
  );
}

export default PlayerPlaylist;
