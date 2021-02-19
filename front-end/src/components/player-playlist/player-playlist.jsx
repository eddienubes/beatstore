import React, {useMemo} from 'react';
import {Table} from "semantic-ui-react";
import PlayerPlaylistItem from "../player-playlist-item";

import './player-playlist.scss';

const PlayerPlaylist = (props) => {

    const tracks = useMemo(() => {
        return props.audioList.map(track => {
            return (<PlayerPlaylistItem/>);
        });
    });

    return (
        <div className={`player-playlist-wrapper`}>
            <Table structured unstackable>
                <Table.Body className={`table-body-main`}>
                    {tracks}
                </Table.Body>
            </Table>
        </div>
    )

}

export default PlayerPlaylist;