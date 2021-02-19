import React from 'react';

import './browse-all-button.scss';
import {useHistory} from "react-router-dom";
import {filterDropped} from "../../redux/actions";
import {useDispatch} from "react-redux";

const BrowseAllButton = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();

    return (
        <div className={`browse-all-button-container`}>
            <hr/>
            <button onClick={() => {
                dispatch(filterDropped());
                history.push('/beats');
            }}>
                BROWSE ALL TRACKS
            </button>
        </div>

    );
}

export default BrowseAllButton;