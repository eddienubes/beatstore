import React, {useEffect, useState} from 'react';
import BeatstoreService from "../../services";
import {faPause, faPlay, faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import './current-track.scss';
import ErrorIndicator from "../error-indicator";
import {useDispatch, useSelector} from "react-redux";
import SpinnerAudio from "../spinner-audio";
import {audioLoaded, audioPlayed, audioStopped, filterSearchSet} from "../../redux/actions";
import LicenseTypeModal from "../license-type-modal";
import {useHistory, useParams} from "react-router-dom";
import {filter} from "../../redux/actions/actions";
import useTraceUpdate from "../../hooks/trace-updates-hook";

const CurrentTrack = () => {
    const [track, setTrack] = useState(null);
    const [error, setError] = useState(null);
    const {id, isPlaying} = useSelector(state => state.audioReducer);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const history = useHistory();
    const {id: urlId} = useParams();


    useEffect(() => {
        if (id) {
            history.push(`/beats/${id}`);
        }

        if (urlId) {
            const beatstoreService = new BeatstoreService();
            setLoading(true);
            beatstoreService.getBeatById(urlId)
                .then(({data}) => {
                    setTrack(data.beat);
                    setLoading(false);
                })
                .catch(e => {
                    setLoading(false);
                    setError(e);
                });
        }

    }, [id, urlId]);

    // useTraceUpdate({track, loading, dispatch, show, id, isPlaying, error});

    if (!track) {
        return null;
    }

    if (error) {
        return <ErrorIndicator/>
    }

    // if (loading) {
    //     return
    // }

    const handlePlay = (e) => {
        e.stopPropagation();

        if (track.id === id && isPlaying) {
            dispatch(audioStopped());
        } else if (track.id !== id) {
            dispatch(audioLoaded(track.id));
        } else if (track.id === id && !isPlaying) {
            dispatch(audioPlayed());
        }
    }

    const imageUrl = 'http://localhost:5000/api/' + track.imgUrl;

    const dateObj = new Date(track.loadTime);
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();

    const date = year + "/" + month + "/" + day;


    return (
        <div className={`current-track-container`}>
            {
                !loading ? (
                    <>
                        <div className={`img-container-featured`}>
                            <img src={imageUrl} alt="featured track image"/>
                        </div>
                        <div className={`content`}>
                            <div className={`content-img-container-featured`}>
                                <img src={imageUrl} alt="featured track image"/>
                                <div className={`icon-play-container`}
                                     onClick={handlePlay}
                                >
                                    <FontAwesomeIcon className={`icon-play`}
                                                     icon={id === track.id && isPlaying ? faPause : faPlay}/>
                                </div>
                            </div>
                            <div className={`info`}>
                                <p className={`caption`}>CURRENTLY PLAYING TRACK</p>
                                <p className={`caption`}>🕒 {date}</p>
                                <p className={`author`}>✍ Cherries By</p>
                                <p className={`title`}>{track.title}</p>
                                <div className={`footer`}>
                                    <button className="track__to-cart-button" onClick={(e) => {
                                        e.stopPropagation();
                                        setShow(true);
                                    }}>
                                        <FontAwesomeIcon icon={faShoppingCart}/> ADD
                                    </button>
                                    <LicenseTypeModal key={track.id}
                                                      track={track}
                                                      buttonClass="cart_button"
                                                      show={show}
                                                      setOpen={setShow}/>
                                    <div className={`tags-container`}>
                                        {track.tags.map((t, index) => {
                                            if (index < 3) {
                                                return (<p
                                                    key={index + t + track.id}
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        dispatch(filterSearchSet(e.target.innerText));
                                                        dispatch(filter(undefined, Math.floor(window.innerHeight / 65)));
                                                    }}
                                                >#{t}</p>);
                                            }
                                        })}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </>
                ) : (<SpinnerAudio/>)
            }

        </div>
    )
};

export default CurrentTrack;