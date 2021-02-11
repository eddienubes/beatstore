import React, {useEffect, useState} from "react";
import Track from "../track";
import {useDispatch, useSelector} from "react-redux";
import ErrorIndicator from "../error-indicator";
import {fetchBeats} from "../../redux/actions";
import {Table} from 'semantic-ui-react';
import Spinner from "../spinner";

import "./tracks-table.scss";
import InfiniteScroll from "react-infinite-scroll-component";

const TracksTable = ({isMain = true}) => {
    const [selectedId, setSelected] = useState(null);
    const {beatList, isLoading, error, hasMore, skip} = useSelector(state => state.beatsReducer);
    const [bottomVisible, setBottomVisible] = useState(false);
    const dispatch = useDispatch();

    const loadBeats = (limit) => {
        dispatch(fetchBeats(limit));
    };

    useEffect(() => {
        if (beatList.length === 0) {
            // 65 is the number of pixels that determine the height of 1 beat
            const firstMountBeatCount = Math.floor(window.innerHeight / 65);
            loadBeats(firstMountBeatCount);

        } else if (
            hasMore &&
            !isLoading &&
            beatList.length === 0) {
            loadBeats();
        }
    }, []);


    if (error) {
        return <ErrorIndicator/>
    }


    const tracks = beatList.map((beat, index) => {
            return <Track
                index={index}
                key={beat.id}
                track={beat}
                onSelected={(id) => setSelected(id)}
                selectedId={selectedId}
            />;
        }
    );

    return (
        <InfiniteScroll next={!isMain ? loadBeats : null} hasMore={hasMore} loader={null} dataLength={beatList.length}>
            <div className={`tracks-table-main`} onScroll={e => console.log(e.target)}>
                <Table structured unstackable>
                    <Table.Header>
                        <Table.Row className={`table-head`}>
                            <Table.HeaderCell className={'tracks__gray-text '} width={6} textAlign="left">
                                <div className="track__td-img"></div>
                                TITLE
                            </Table.HeaderCell>
                            <Table.HeaderCell className={'tracks__gray-text'} width={1}>
                                TIME
                            </Table.HeaderCell>
                            <Table.HeaderCell className={'tracks__gray-text'} width={1}>
                                BPM
                            </Table.HeaderCell>
                            <Table.HeaderCell className={'tracks__gray-text tracks__scale'} width={1}>
                                SCALE
                            </Table.HeaderCell>
                            <Table.HeaderCell className={'tracks__gray-text track__tags'} width={5}>
                                TAGS
                            </Table.HeaderCell>
                            <Table.HeaderCell className={'tracks__gray-text'} width={1}>

                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body className={`table-body-main`}>
                        {isMain ? tracks.slice(0, 10) : tracks}
                    </Table.Body>

                </Table>
                {isLoading && <Spinner/>}
            </div>
        </InfiniteScroll>
    );
};

export default TracksTable;
