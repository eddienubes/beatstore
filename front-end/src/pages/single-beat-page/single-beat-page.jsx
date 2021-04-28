import React, { useEffect, useState } from 'react';
import './single-beat-page.scss';
import { Redirect, useParams } from "react-router-dom";
import CurrentTrack from "../../components/current-track";
import CommentSection from "../../components/comment-section";
import CommentInput from "../../components/comment-input";
import BeatstoreService from "../../services";
import FastAverageColor from "fast-average-color";
import ErrorIndicator from "../../components/error-indicator";
import Spinner from "../../components/spinner";
import { useSelector } from "react-redux";
import PageNotFound from "../../components/page-not-found";

const SingleBeatPage = () => {
    const { id: urlId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [track, setTrack] = useState(null);
    const [color, setColor] = useState(null);
    const {id, token, loggedIn} = useSelector(state => state.userReducer);

    useEffect(() => {
        const beatstoreService = new BeatstoreService();
        setLoading(true);
        beatstoreService.getBeatById(urlId)
            .then(({ data }) => {
                setTrack(data.beat);
                const fac = new FastAverageColor();

                fac.getColorAsync(process.env.REACT_APP_BACKEND_ASSET_URL + data.beat.imgUrl)
                    .then(color => {
                        setColor(color.hex);
                        setLoading(false);
                    })
                    .catch(error => {
                        setError(error);
                        setLoading(false);
                    });
            })
            .catch(e => {
                console.log(e);
                setLoading(false);
                setError(e);
            });

    }, [urlId]);

    const handleLeaveComment = (beatId, value, setError, setLoading) => {
        const beatstoreService = new BeatstoreService();
        setLoading(true);
        beatstoreService.leaveComment(value, beatId, id, token)
            .then(res => {
                setLoading(false);
                setTrack(state => {
                    return {
                        ...state,
                        comments: [res.data.comment, ...track.comments]
                    }
                });
            })
            .catch(error => {
                setLoading(false);
                setError(error);
            });
    }

    if (!track && !loading) {
        return <PageNotFound/>
    }

    if (error) {
        return <ErrorIndicator/>
    }

    if (loading) {
        return <Spinner/>
    }

    return (
        <div className="single-beat__wrapper">
            <CurrentTrack color={color} track={track}/>
            <CommentInput beatId={track.id} handleSend={handleLeaveComment}/>
            <CommentSection isLoggedIn={loggedIn} userId={id} comments={track.comments}/>
        </div>
    );
}

export default SingleBeatPage;

