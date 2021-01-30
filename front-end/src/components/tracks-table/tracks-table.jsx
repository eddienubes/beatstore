import React, {useState, useContext, useEffect} from "react";
import "./tracks-table.scss";
import Track from "../track";
import {withSearch} from '../hoc';
import Spinner from "../spinner";
import {useSelector, useDispatch} from "react-redux";
import ErrorIndicator from "../error-indicator";

const TracksTable = ({filter, search}) => {
    const [selectedId, setSelected] = useState(null);
    const {beatList, isLoading, error} = useSelector(state => state.beatsReducer);
    const dispatch = useDispatch;


    if (error) {
        return <ErrorIndicator/>
    }

    if (isLoading) {
        return <Spinner/>
    }

    // const tracks = beatList.map((beat) => {
    //         return filter(beat, search.query) ? <Track key={beat.id}
    //                                                    track={beat}
    //         /> : null;
    //     }
    // );
    const tracks = beatList.map((beat) => {
            return <Track key={beat.id}
                          track={beat}
                          onSelected={(id) => setSelected(id)}
                          selectedId={selectedId}
            />;
        }
    );

    return (
        <div className="tracks-table">
            <table cellSpacing={0} id="top-10-track-table">
                <tbody>
                <tr className="table-head">
                    <td/>
                    <td className="title">
                        TITLE
                    </td>
                    <td className="time">
                        TIME
                    </td>
                    <td className="bpm">
                        BPM
                    </td>
                    <td className="tags-cap">
                        TAGS
                    </td>
                    <td/>
                </tr>
                {tracks}
                </tbody>
            </table>

        </div>
    );
};

export default withSearch(TracksTable);
