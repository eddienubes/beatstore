import React, {useCallback, useEffect, useMemo, useState} from "react";
import './basket-item.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes, faPlayCircle, faPauseCircle} from "@fortawesome/free-solid-svg-icons";
import LicenseDescriptionButton from "../license-description-button";
import {Table} from "semantic-ui-react";
import {useDispatch, useSelector} from "react-redux";
import {audioLoaded, audioPlayed, audioStopped, removeFromCart} from "../../redux/actions";
import SpinnerAudio from "../spinner-audio";
import useAudio from "../../hooks/audio-hook";

const BasketItem = ({id, product, amount, licenseType, imgUrl, className, setShow, beatId, isPlaying, currentId, previousId, type}) => {
    const dispatch = useDispatch();

    const imageUrl = useMemo(() => 'http://localhost:5000/api/' + imgUrl, [imgUrl]);

    const onClick = (e) => {
        e.stopPropagation();

        if (beatId === currentId && isPlaying) {
            dispatch(audioStopped());
        } else if (beatId !== currentId) {
            dispatch(audioLoaded(beatId));
        } else if (beatId === currentId && !isPlaying) {
            dispatch(audioPlayed());
        }
    };

    return (
        <Table.Row className={"main-row " + className}>
            <Table.Cell verticalAlign="middle" textAlign="center" className="img-container row-item" sm={2}>
                <button className='play-button-cart' onClick={onClick}>
                    <FontAwesomeIcon icon={isPlaying && currentId === beatId ? faPauseCircle : faPlayCircle  }/>
                </button>
                <img className='img-cart'
                     src={imageUrl}
                     alt="Track"/>
            </Table.Cell>
            <Table.Cell textAlign="left" verticalAlign="middle" className="row-item">
                {product}
            </Table.Cell>
            <Table.Cell textAlign="center" verticalAlign="middle" className="row-item">
                {licenseType}
            </Table.Cell>
            <Table.Cell textAlign="center" verticalAlign="middle" className="row-item">
                {amount}$
            </Table.Cell>
            <Table.Cell textAlign="center" width={1} verticalAlign="middle" className="row-item button-license">
                <LicenseDescriptionButton className="button" text="REVIEW LICENSE" type={type}/>
            </Table.Cell>
            <Table.Cell width={1} verticalAlign="middle" textAlign="center"
                        className="row-item remove-from-cart-button-container">
                <button className="remove-from-cart-button" onClick={e => {
                    dispatch(removeFromCart(id));
                    setShow(false)
                }}>
                    <FontAwesomeIcon className='basket__remove-item' icon={faTimes}/>
                </button>
            </Table.Cell>
        </Table.Row>
    )
};

export default React.memo(BasketItem, (prevProps, nextProps) => {
    const trackId = prevProps.beatId;

    if (prevProps.className !== nextProps.className) {
        return false;
    }

    return (trackId !== nextProps.currentId &&
        trackId !== nextProps.previousId);
});