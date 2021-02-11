import React from 'react';
import './license-type-modal.scss';
import {Col, Row} from 'react-bootstrap'
import {Button, Modal, TransitionablePortal} from 'semantic-ui-react'
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const ToCartButton = ({track, price, licenseType, setOpen, caption, desc, popup}) => {
    return (
        <button onClick={(e) => {
            e.stopPropagation();
            setOpen();
        }
        }
                className="license-button-choice mp3-lease">
            <div className="license__choice-caption">{caption}</div>
            <div className="license__choice-price">${price}</div>
            <div className="license__choice-desc">{desc}</div>
            <div className="popup">{popup}</div>
        </button>
    );
};

const LicenseTypeModal = (props) => {

    let show = props.show;
    const setOpen = props.setOpen;
    const prices = [1, 2, 3, 4, '~'];
    const captions = ['mp3 lease', 'wav lease', 'track out lease', 'unlimited lease', 'exclusive'];
    const desc = ['MP3', 'MP3 AND WAV', 'MP3, WAV AND TRACK STEMS', 'MP3, WAV AND TRACK STEMS' ,'JUST CONTACT ME ' +
    'VIA CONTACT FORM OR USING' +
    'EMAIL/INSTAGRAM'];
    const popups = ['CLICK TO ADD IN YOUR CART', 'CLICK TO GO TO CONTACT PAGE'];

    return (
        <TransitionablePortal open={show} transition={{animation: 'zoom', duration: 350}}>
            <Modal
                dimmer="blurring"
                className="license__main-modal-container"
                basic
                onOpen={(e) => {
                    e.stopPropagation();

                    setOpen(true);
                }}
                onClose={(e) => {
                    e.stopPropagation();


                    setOpen(false);
                }}
                open={true}
                size='small'
                centered
            >
                <Modal.Content onClick={e => {e.stopPropagation()}} className="licenses-container">
                    <div className="licenses-container">
                        <Row className="track-description-container">
                            <Col xl={1} md={2} sm={2} className="license__img-container">
                                <img className="license__img-main" src={props.track.imgUrl} alt="track"/>
                            </Col>
                            <Col xl={6} md={4} sm={4} className="license__beat_information">
                                <div className="license__beat-name">
                                    <span className="license__green">Track name:</span> {props.track.name}
                                </div>
                                <div className="license__author-name">
                                    <span className="license__green">Producer:</span> Cherries
                                </div>
                                <div className="license__tags-container">
                                    <span>Tags:</span> {props.track.tags.map((tag, i) => <span key={i}
                                                                                               className="tag">#{tag}</span>)}
                                </div>
                                <div className="license__bpm">
                                    <span className="license_bpm-caption">BPM: </span> {props.track.bpm}
                                </div>
                            </Col>
                        </Row>
                        <Row>

                            <Col xl={3} md={4} sm={12}>
                                <ToCartButton price={prices[0]}
                                              caption={captions[0]}
                                              desc={desc[0]}
                                              popup={popups[0]}
                                              setOpen={() => {setOpen(false)}}
                                />
                            </Col>
                            <Col xl={3} md={4} sm={12}>
                                <ToCartButton price={prices[1]}
                                              caption={captions[1]}
                                              desc={desc[1]}
                                              popup={popups[0]}
                                              setOpen={() => {setOpen(false)}}
                                />
                            </Col>
                            <Col xl={3} md={4} sm={12}>
                                <ToCartButton price={prices[2]}
                                              caption={captions[2]}
                                              desc={desc[2]}
                                              popup={popups[0]}
                                              setOpen={() => {setOpen(false)}}
                                />
                            </Col>
                            <Col xl={3} md={6} sm={12}>
                                <ToCartButton price={prices[3]}
                                              caption={captions[3]}
                                              desc={desc[3]}
                                              popup={popups[0]}
                                              setOpen={() => {setOpen(false)}}
                                />
                            </Col>

                            <Col xl={12} md={6} sm={12}>
                                <ToCartButton price={prices[4]}
                                              caption={captions[4]}
                                              desc={desc[4]}
                                              popup={popups[1]}
                                              setOpen={() => {setOpen(false)}}
                                />
                            </Col>
                        </Row>
                    </div>
                </Modal.Content>
                <Modal.Actions onClick={e => e.stopPropagation()}>
                    <Button basic color='green' className="license__choice-close-button" inverted
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(false)
                            }}>
                        <div className="license__close-button-icon"><FontAwesomeIcon icon={faTimes}/> Close</div>
                    </Button>
                </Modal.Actions>
            </Modal>
        </TransitionablePortal>
    );
};

export default LicenseTypeModal;

