import React, {useContext, useEffect, useMemo, useState} from "react";
import "./track.scss";
import {faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LicenseTypeModal from "../license-type-modal";
import {Table} from 'semantic-ui-react';
import {useDispatch} from "react-redux";
import {audioLoaded, audioPlayed, audioStopped, filterDropped, filterSearchSet} from "../../redux/actions";
import AudioInstanceContext from "../audio-instance-context";
import useTraceUpdate from '../../hooks/trace-updates-hook';
import {useHistory} from "react-router-dom";
import {filter} from "../../redux/actions/actions";

const Track = ({track, onSelected, index, id, previousId, isPlaying}) => {

    const [modalShow, setModalShow] = useState(false);
    const [isActive, setActive] = useState(false);
    const dispatch = useDispatch();
    const {audioInstance} = useContext(AudioInstanceContext).state;
    const history = useHistory();

    // useTraceUpdate({isActive, audioInstance, id, previousId, isPlaying});

    useEffect(() => {
        if (track.id === id && isPlaying) {
            setActive(true);
        } else if (track.id === id && !isPlaying) {
            setActive(false);
        } else {
            setActive(false);
        }
    }, [id, isPlaying]);

    // TODO MOVE onClick logic to redux
    // TODO ADD Audio Instance to Redux Store

    const onClick = (e) => {
        e.stopPropagation();

        if (track.id === id && isPlaying) {
            dispatch(audioStopped());
        } else if (track.id !== id) {
            dispatch(audioLoaded(track.id));
        }
        else if (track.id === id && !isPlaying) {
            dispatch(audioPlayed());
        }
    };

    const imageUrl = useMemo(() => 'http://localhost:5000/api/' + track.imgUrl, [track]);

    // useTraceUpdate({track, id, previousId, isPlaying});

    return (
        <Table.Row className={`main-row-track ${isActive ? "selected_tr" : null}`}
                   onClick={onClick}>
            <Table.Cell className={`tracks__title`}>
                <div className="track__td-img">
                    <img className="td-img-main" src={imageUrl} alt="beat image"/>
                </div>
                {track.title}
            </Table.Cell>
            <Table.Cell>
                {track.duration}
            </Table.Cell>
            <Table.Cell>
                {track.bpm}
            </Table.Cell>
            <Table.Cell className={`tracks__scale`}>
                {track.scale}
            </Table.Cell>
            <Table.Cell className={`track__tags`}>
                <div className={`tags-container`}>
                    {track.tags.map((tag, i) => <b
                        key={i}
                        className="track__tag"
                        onClick={e => {
                            e.stopPropagation();
                            // dispatch(filterDropped());
                            dispatch(filterSearchSet(e.target.innerText));
                            dispatch(filter(undefined, Math.floor(window.innerHeight / 65)));
                            history.push('/beats');
                        }}
                    >#{tag}</b>)}
                </div>
            </Table.Cell>
            <Table.Cell className={`tracks__button-buy`}>
                <button className="track__to-cart-button" onClick={(e) => {
                    e.stopPropagation();
                    setModalShow(true);
                }}>
                    <FontAwesomeIcon icon={faShoppingCart}/> ADD
                </button>
                <LicenseTypeModal key={track.id}
                                  track={track}
                                  buttonClass="cart_button"
                                  show={modalShow}
                                  setOpen={setModalShow}/>
            </Table.Cell>
        </Table.Row>

    );
}


export default React.memo(Track, (prevProps, nextProps) => {
    const trackId = prevProps.track.id;

    return trackId !== nextProps.id &&
        trackId !== nextProps.previousId;
});