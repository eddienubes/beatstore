import React, {useContext, useState} from 'react';
import Card from "react-bootstrap/Card";
import "./price-cards-list.scss";
import Accordion from 'react-bootstrap/Accordion'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import CardDeck from 'react-bootstrap/CardDeck';
import LicenseDescriptionButton from "../license-description-button";
import AccordionButton from "../accordion-button";
import {faTag} from "@fortawesome/free-solid-svg-icons";


const PriceCardsList = () => {
    const [activeKey, setActiveKey] = useState(null);
    const prices = [0, 1, 2, 3, 4];

    return (
        <CardDeck className="card-container">
            <Card className="card popular-card">
                <div className="head">
                    <p>POPULAR</p>
                    <div className="license-type">
                        Wav Lease
                    </div>
                    <div className="price">
                        ${prices[1].price}
                    </div>
                    <div className="per-unit">
                        PER UNIT
                    </div>
                </div>
                <div className="description">
                    <ul>
                        <li>Untagged Wav</li>
                        <li>Sell up to 10000 units</li>
                        <li>Commercial Use</li>
                        <li>Able to put song on all platforms (Spotify, Apple Music etc.)</li>
                        <li>Must Credit (prod. eddienubes)</li>

                    </ul>
                    <div className="license-button-container">
                        <LicenseDescriptionButton className="license-button-popular" text="Read License"/>
                    </div>
                </div>
                <div className="card-footer card-footer-white">
                    <div className="card-footer-caption">
                        <span><FontAwesomeIcon className="icon" icon={faTag}/> FREE BEATS</span>
                        <p>BUY 2, GET 1 FREE</p>
                    </div>
                    <Accordion activeKey={activeKey} onSelect={e => setActiveKey(e)}>
                        <Accordion.Collapse className="card-footer-content" eventKey="0">
                            <div>
                                <p>
                                    BUY 3, GET 2 FREE
                                </p>
                                <p>
                                    BUY 4, GET 3 FREE
                                </p>
                                <p>
                                    BUY 5, GET 4 FREE
                                </p>
                                <p>
                                    BUY 6, GET 5 FREE
                                </p>
                                <p>
                                    BUY 10, GET 10 FREE
                                </p>
                            </div>
                        </Accordion.Collapse>
                        <div className="button-container">
                            <AccordionButton eventKey="0"/>
                        </div>

                    </Accordion>
                </div>

            </Card>
            <Card className="card">
                <div className="head">
                    <div className="license-type">
                        MP3 Lease
                    </div>
                    <div className="price">
                        ${prices[0].price}
                    </div>
                    <div className="per-unit">
                        PER UNIT
                    </div>
                </div>
                <div className="description">
                    <ul>
                        <li>Untagged mp3</li>
                        <li>Sell up to 5000 units</li>
                        <li>Commercial Use</li>
                        <li>Able to put song on all platforms (Spotify, Apple Music etc.)</li>
                        <li>Must Credit (prod. cherriesby)</li>
                    </ul>
                    <div className="license-button-container">
                        <LicenseDescriptionButton className="license-button" text="Read License"/>
                    </div>
                </div>
                <div className="card-footer card-footer-black">
                    <div className="card-footer-caption">
                        <span><FontAwesomeIcon className="icon" icon={faTag}/> FREE BEATS</span>
                        <p>BUY 2, GET 1 FREE</p>
                    </div>

                    <Accordion activeKey={activeKey} onSelect={e => setActiveKey(e)}>
                        <Accordion.Collapse className="card-footer-content" eventKey="1">
                            <div>
                                <p>
                                    BUY 3, GET 2 FREE
                                </p>
                                <p>
                                    BUY 4, GET 3 FREE
                                </p>
                                <p>
                                    BUY 5, GET 4 FREE
                                </p>
                                <p>
                                    BUY 6, GET 5 FREE
                                </p>
                                <p>
                                    BUY 10, GET 10 FREE
                                </p>
                            </div>
                        </Accordion.Collapse>
                        <div className="button-container">
                            <AccordionButton eventKey="1"/>
                        </div>

                    </Accordion>
                </div>

            </Card>
            <Card className="card">
                <div className="head">
                    <div className="license-type">
                        Track Out Lease
                    </div>
                    <div className="price">
                        ${prices[2].price}
                    </div>
                    <div className="per-unit">
                        PER UNIT
                    </div>
                </div>
                <div className="description">
                    <ul>
                        <li>Untagged wav track stems</li>
                        <li>Sell up to 20000 units</li>
                        <li>Commercial Use</li>
                        <li>Able to put song on all platforms (Spotify, Apple Music etc.)</li>
                        <li>Must Credit (prod. cherriesby)</li>
                    </ul>
                    <div className="license-button-container">
                        <LicenseDescriptionButton className="license-button" text="Read License"/>
                    </div>
                </div>
                <div className="card-footer card-footer-black">
                    <div className="card-footer-caption">
                        <span><FontAwesomeIcon className="icon" icon={faTag}/> FREE BEATS</span>
                        <p>BUY 2, GET 1 FREE</p>
                    </div>

                    <Accordion activeKey={activeKey} onSelect={e => setActiveKey(e)}>
                        <Accordion.Collapse className="card-footer-content" eventKey="2">
                            <div>
                                <p>
                                    BUY 3, GET 2 FREE
                                </p>
                                <p>
                                    BUY 4, GET 3 FREE
                                </p>
                                <p>
                                    BUY 5, GET 4 FREE
                                </p>
                                <p>
                                    BUY 6, GET 5 FREE
                                </p>
                                <p>
                                    BUY 10, GET 10 FREE
                                </p>
                            </div>
                        </Accordion.Collapse>
                        <div className="button-container">
                            <AccordionButton eventKey="2"/>
                        </div>

                    </Accordion>
                </div>

            </Card>
            <Card className="card">
                <div className="head">
                    <div className="license-type">
                        Unlimited Lease
                    </div>
                    <div className="price">
                        ${prices[3].price}
                    </div>
                    <div className="per-unit">
                        PER UNIT
                    </div>
                </div>
                <div className="description">
                    <ul>
                        <li>Untagged Wav Track stems</li>
                        <li>Unlimited Distribution</li>
                        <li>Unlimited Commercial Use</li>
                        <li>Able to put song on all platforms (Spotify, Apple Music etc.)</li>
                        <li>Must Credit (prod. eddienubes)</li>
                    </ul>
                    <div className="license-button-container">
                        <LicenseDescriptionButton className="license-button" text="Read License"/>
                    </div>
                </div>
                <div className="card-footer card-footer-black">
                    <div className="card-footer-caption">
                        <span><FontAwesomeIcon className="icon" icon={faTag}/> FREE BEATS</span>
                        <p>BUY 2, GET 1 FREE</p>
                    </div>

                    <Accordion activeKey={activeKey} onSelect={e => setActiveKey(e)}>
                        <Accordion.Collapse className="card-footer-content" eventKey="3">
                            <div>
                                <p>
                                    BUY 3, GET 2 FREE
                                </p>
                                <p>
                                    BUY 4, GET 3 FREE
                                </p>
                                <p>
                                    BUY 5, GET 4 FREE
                                </p>
                                <p>
                                    BUY 6, GET 5 FREE
                                </p>
                                <p>
                                    BUY 10, GET 10 FREE
                                </p>
                            </div>
                        </Accordion.Collapse>
                        <div className="button-container">
                            <AccordionButton eventKey="3"/>
                        </div>

                    </Accordion>
                </div>

            </Card>
            <Card className="card">
                <div className="head">
                    <div className="license-type">
                        Exclusive License
                    </div>
                    <div className="price">
                        CONTACT
                    </div>
                    <div className="per-unit">
                        ME
                    </div>
                </div>
                <div className="description">
                    <ul>
                        <li>Untagged Wav Track stems</li>
                        <li>Unlimited Distribution</li>
                        <li>Unlimited Commercial Use</li>
                        <li>Able to put song on all platforms (Spotify, Apple Music etc.)</li>
                        <li>Must Credit (prod. eddienubes)</li>
                    </ul>
                    <div className="license-button-container">
                        <LicenseDescriptionButton className="license-button" text="Read License"/>
                    </div>
                </div>
                <div className="card-footer card-footer-black">
                    <div className="card-footer-caption">
                        <span><FontAwesomeIcon className="icon" icon={faTag}/> FREE BEATS</span>
                        <p>BUY 2, GET 1 FREE</p>
                    </div>

                    <Accordion activeKey={activeKey} onSelect={e => setActiveKey(e)}>
                        <Accordion.Collapse className="card-footer-content" eventKey="4">
                            <div>
                                <p>
                                    BUY 3, GET 2 FREE
                                </p>
                                <p>
                                    BUY 4, GET 3 FREE
                                </p>
                                <p>
                                    BUY 5, GET 4 FREE
                                </p>
                                <p>
                                    BUY 6, GET 5 FREE
                                </p>
                                <p>
                                    BUY 10, GET 10 FREE
                                </p>
                            </div>
                        </Accordion.Collapse>
                        <div className="button-container">
                            <AccordionButton eventKey="4"/>
                        </div>

                    </Accordion>
                </div>

            </Card>
        </CardDeck>
    )
};

export default PriceCardsList;