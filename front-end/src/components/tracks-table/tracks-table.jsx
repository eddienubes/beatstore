import React, {useContext, useEffect, useMemo, useState} from "react";
import Track from "../track";
import {useDispatch, useSelector} from "react-redux";
import ErrorIndicator from "../error-indicator";
import {fetchBeats, filterDropped} from "../../redux/actions";
import {Table} from 'semantic-ui-react';
import Spinner from "../spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import AudioInstanceContext from "../audio-instance-context";

import "./tracks-table.scss";
import {beatsDropped} from "../../redux/actions/actions";

const TracksTable = ({isMain = true}) => {
    const [selectedId, setSelected] = useState(null);
    const {
        beatList,
        isLoading,
        error,
        hasMore,
        skip,
        isFiltering,
        filter,
    } = useSelector(state => state.beatsReducer);
    const {audioInstance} = useContext(AudioInstanceContext).state;
    const dispatch = useDispatch();
    const {id, isPlaying, previousId} = useSelector(state => state.audioReducer);

    const firstMountBeatCount = useMemo(() => Math.floor(window.innerHeight / 65), [window.innerHeight]);

    const loadBeats = (limit) => {
        dispatch(fetchBeats(limit));
    };

    useEffect(() => {
        // dispatch(filterDropped());

        dispatch(fetchBeats(firstMountBeatCount));
        // if (hasMore && !isLoading && !isFiltering) {
        //     loadBeats(firstMountBeatCount);
        // }

        return () => {
            if (!isMain) {
                dispatch(filterDropped());
            }
            else {
                dispatch(beatsDropped());
            }
        }
    }, []);

    const tracks = useMemo(() => {
        return beatList.map((beat, index) => {
            return <Track
                index={index}
                key={beat.id}
                track={beat}
                onSelected={(id) => setSelected(id)}
                selectedId={selectedId}
                id={id}
                isPlaying={isPlaying}
                previousId={previousId}
            />;
        })
    }, [beatList, id, isPlaying, previousId, isFiltering]);

    if (error) {
        return <ErrorIndicator/>
    }

    if ((!audioInstance || isFiltering) && !isMain) {
        return <Spinner/>
    }

    if (!isFiltering &&
        beatList.length === 0 &&
        !isLoading &&
        !isMain &&
        (filter.search !== '' ||
            filter.bpm ||
            filter.genres ||
            filter.moods ||
            filter.tags)
    ) {
        return <p className={`no-matches`}>Sorry, unfortunately we haven't found any beats matching your request...</p>
    }

    return (
        <InfiniteScroll next={!isMain && beatList.length > 0 ? loadBeats : null} hasMore={hasMore} loader={null}
                        dataLength={beatList.length}>
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

export default React.memo(TracksTable);
