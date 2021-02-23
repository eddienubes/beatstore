import React, {useState} from "react";
import './basket-item.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes, faPlayCircle, faPauseCircle} from "@fortawesome/free-solid-svg-icons";
import LicenseDescriptionButton from "../license-description-button";
import {Table} from "semantic-ui-react";

const BasketItem = ({id, product, amount, licenseType, imgUrl, show}) => {

    return (
        <Table.Row className="main-row">
            <Table.Cell verticalAlign="middle" textAlign="center" className="img-container row-item" sm={2}>
                <button className='play-button-cart'>
                    <FontAwesomeIcon icon={faPlayCircle}/>
                </button>
                <img className='img-cart'
                     src={imgUrl}
                     alt="Track"/>
            </Table.Cell>
            <Table.Cell textAlign="left" verticalAlign="middle" className="row-item">
                {product}
            </Table.Cell>
            <Table.Cell textAlign="center" verticalAlign="middle" className="row-item">
                {licenseType}
            </Table.Cell>
            <Table.Cell textAlign="center" verticalAlign="middle" className="row-item">
                {amount}
            </Table.Cell>
            <Table.Cell textAlign="center" width={1} verticalAlign="middle" className="row-item button-license">
                <LicenseDescriptionButton className="button" text="License"/>
            </Table.Cell>
            <Table.Cell width={1} verticalAlign="middle" textAlign="center"
                        className="row-item remove-from-cart-button-container">
                <button className="remove-from-cart-button">
                    <FontAwesomeIcon className='basket__remove-item' icon={faTimes}/>
                </button>
            </Table.Cell>
        </Table.Row>
    )
};

export default BasketItem;