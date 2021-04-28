import React from 'react';
import './track-title.scss';
import { Link } from "react-router-dom";

const TrackTitle = ({ id, title }) => {
    return (
        <span className="track-title-container">
            <Link onClick={e => e.stopPropagation()} to={`/beats/${id}`}>{title}</Link>
        </span>
    )
}

export default TrackTitle;