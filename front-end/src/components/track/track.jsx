import React, {useContext, useEffect, useState} from "react";
import "./track.scss";
import {faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LicenseTypeModal from "../license-type-modal";
import {withPlayables} from '../hoc';
import {Table} from 'semantic-ui-react';
import {useDispatch, useSelector} from "react-redux";
import {audioPlayed, audioStopped} from "../../redux/actions";
import AudioInstanceContext from "../audio-instance-context";


const Track = ({track, onSelected, index}) => {

    const [modalShow, setModalShow] = useState(false);
    const [isActive, setActive] = useState(false);
    const {id, isPlaying, previousId} = useSelector(state => state.audioReducer);
    const dispatch = useDispatch();
    const {audioInstance} = useContext(AudioInstanceContext).state;

    useEffect(() => {
        if (track.id === id) {
            setActive(true);
        }
        else {
            setActive(false);
        }
    }, [id]);

    const onClick = () => {
        // if (isActive) {
        //     onSelected(null);
        // }
        // else {
        //     onSelected(track.id);
        // }
        ///////
        // playBack();
        if (id === track.id && !isPlaying) {
            audioInstance.play();
        }
        else if (id === track.id && isPlaying) {
            audioInstance.pause();
        }
        else if (previousId === track.id && id) {
            audioInstance.playByIndex(index);
        }
        else if (track.id) {
            console.log('here', index);
            audioInstance.playByIndex(index);
        }

    }
    const imageUrl = 'http://localhost:5000/api/' + track.imgUrl;
    return (
        // <Table.Row>
        //     <Table.Cell>
        //
        //     </Table.Cell>
        // </Table.Row>
        <Table.Row className={`main-row-track ${isActive ? "selected_tr" : null}`}
            onClick={onClick}>
            <Table.Cell className={`tracks__title`}>
                <div className="track__td-img">
                    <img className="td-img-main" src={imageUrl} alt="beat image"/>
                </div>
                {track.title}sadasdasdsadasdasdsadasdasdsadasdasdsadasdasdsadasdasdsadasdasdsadasdasdsadasdasdsadasdasdsadasdasdsadasdasdsadasdasdsadasdasd
            </Table.Cell>
            <Table.Cell >
                {track.duration}
            </Table.Cell>
            <Table.Cell >
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


export default withPlayables(Track);
