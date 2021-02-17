import React, {useContext, useEffect, useMemo, useState} from "react";
import "./track.scss";
import {faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LicenseTypeModal from "../license-type-modal";
import {Table} from 'semantic-ui-react';
import {useDispatch} from "react-redux";
import {audioLoaded, audioPlayed, audioStopped} from "../../redux/actions";
import AudioInstanceContext from "../audio-instance-context";

const Track = ({track, onSelected, index, id, previousId, isPlaying}) => {

    const [modalShow, setModalShow] = useState(false);
    const [isActive, setActive] = useState(false);
    const dispatch = useDispatch();
    const {audioInstance} = useContext(AudioInstanceContext).state;

    // useTraceUpdate({isActive, audioInstance, id, previousId, isPlaying});

    useEffect(() => {
        // const baseUrl = 'http://localhost:5000/api/';
        // const itsUrl = baseUrl + track.previewAudioUrl.replaceAll('\\', '/');
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
        // const baseUrl = 'http://localhost:5000/api/';
        // const itsUrl = baseUrl + track.previewAudioUrl.replaceAll('\\', '/');

        e.stopPropagation();

        if (track.id === id && isPlaying) {
            console.log('            dispatch(audioStopped());\n');
            dispatch(audioStopped());
        } else if (track.id !== id) {
            dispatch(audioLoaded(track.id));
        }
        else if (track.id === id && !isPlaying) {
            dispatch(audioPlayed());
        }

        // if (index === 0 && track.id !== id) {
        //     console.log('here play 2');
        //
        //     audioInstance.playByIndex(index);
        // }
        // if (track.id === id && !isPlaying) {
        //     console.log('here play 1');
        //
        //     audioInstance.play();
        // }
        // else if (track.id === id && isPlaying) {
        //     console.log('here pause');
        //     audioInstance.pause();
        //     return;
        // }
        // else if (index === 0 && !id && !previousId) {
        //     // console.log('here index === 0 && !id && !previousId', id, previousId);
        //     console.log('here play');
        //     audioInstance.play();
        // }
        // else if (!id && previousId) {
        //     console.log('here play 4');
        //
        //     // console.log('here !id && previousId', id, previousId);
        //     audioInstance.playByIndex(index);
        // }
        // else {
        //     console.log('here play 3');
        //
        //     // console.log('here');
        //     audioInstance.playByIndex(index);
        // }
        // audioInstance.play();
    };


    const imageUrl = useMemo(() => 'http://localhost:5000/api/' + track.imgUrl, [track]);

    // useEffect(() => {
    //     console.log('render', index, track.id);
    // });
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
                    {track.tags.map((tag, i) => <b key={i} className="track__tag">#{tag}</b>)}
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
    const index = prevProps.index;

    // // if (!prevProps.id && !prevProps.previousId) {
    // //     return false;
    // // }
    // if (index === 0) {
    //     // console.log(trackId === nextProps.id, index);
    //     return false;
    // }

    // if (
    //     trackId !== nextProps.url &&
    //     trackId !== nextProps.previousUrl)
    // {
    //     return true;
    // }
    // else {
    //     return false;
    // }
});