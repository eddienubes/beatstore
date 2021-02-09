import React, {useEffect, useState} from "react";
import "./tracks-table.scss";
import Track from "../track";
import {withSearch} from '../hoc';
import Spinner from "../spinner";
import {useDispatch, useSelector} from "react-redux";
import ErrorIndicator from "../error-indicator";
import InfiniteScroll from "react-infinite-scroll-component";
import {fetchBeats} from "../../redux/actions";
import {Table} from 'semantic-ui-react';

const TracksTable = ({hasMoreByDefault}) => {
    const [selectedId, setSelected] = useState(null);
    const [skip, setSkip] = useState(0);
    const {beatList, isLoading, error} = useSelector(state => state.beatsReducer);
    const dispatch = useDispatch();
    const [hasMore, setMore] = useState(true);

    const nextHandler = () => {
        console.log('here');
        const newSkip = skip + 5;
        dispatch(fetchBeats(newSkip));
        setSkip(newSkip);
    }

    if (error) {
        return <ErrorIndicator/>
    }

    // const beats = beatList.map((beat) => {
    //         return filter(beat, search.query) ? <Track key={beat.id}
    //                                                    track={beat}
    //         /> : null;
    //     }
    // );
    const tracks = beatList.map((beat) => {
            return <Track key={beat._id}
                          track={beat}
                          onSelected={(id) => setSelected(id)}
                          selectedId={selectedId}
            />;
        }
    );
    // TODO ADD HAS MORE IN REDUX STORE
    return (
        // <div className="tracks-table">
        //     <InfiniteScroll next={nextHandler} hasMore={hasMoreByDefault} loader={<Spinner/>} dataLength={beatList.length}>
        //         <table id="top-10-track-table">
        //             <tbody>
        //             <tr className="table-head">
        //                 <td/>
        //                 <td className="title">
        //                     TITLE
        //                 </td>
        //                 <td className="time">
        //                     TIME
        //                 </td>
        //                 <td className="bpm">
        //                     BPM
        //                 </td>
        //                 <td className="tags-cap">
        //                     TAGS
        //                 </td>
        //                 <td/>
        //             </tr>
        //             {tracks}
        //             </tbody>
        //         </table>
        //     </InfiniteScroll>
        // </div>
        <div className={`tracks-table-main`}>
            <Table structured striped unstackable>
                <Table.Header className={`table-head`}>
                    <Table.Row>
                        <Table.HeaderCell className={'tracks__title'} width={1} textAlign="left">
                        </Table.HeaderCell>
                        <Table.HeaderCell className={'tracks__title'} width={6} textAlign="left">
                            TITLE
                        </Table.HeaderCell>
                        <Table.HeaderCell className={'tracks__title'} width={1}>
                            TIME
                        </Table.HeaderCell>
                        <Table.HeaderCell className={'tracks__title'} width={1}>
                            BPM
                        </Table.HeaderCell>
                        <Table.HeaderCell className={'tracks__title'} width={1}>
                            SCALE
                        </Table.HeaderCell>
                        <Table.HeaderCell className={'tracks__title'} width={5}>
                            TAGS
                        </Table.HeaderCell>
                        <Table.HeaderCell className={'tracks__title'} width={2}>

                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
            </Table>
        </div>

    );
};

export default withSearch(TracksTable);
