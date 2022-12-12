import React, { useMemo } from 'react';
import './license-type-modal.scss';
import { Col, Row } from 'react-bootstrap';
import { Button, Modal, TransitionablePortal } from 'semantic-ui-react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { useHistory } from 'react-router-dom';
import SpinnerAudio from '../spinner-audio';
import { appendToCart } from '../../redux/actions';

function ToCartButton({ trackId, price, licenseType, setOpen, caption, desc, popup, licenseId, isInCart }) {
  const dispatch = useDispatch();
  const history = useHistory();
  console.log(licenseType);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (licenseType === 5) {
          history.replace('/contact');
        } else {
          dispatch(appendToCart({ product: { beatId: trackId, licenseId } }));
        }
        setOpen();
      }}
      className="license-button-choice mp3-lease"
    >
      {isInCart ? (
        isInCart.licenseId._id.toString() === licenseId ? (
          <div className="selected-in-cart">
            <FontAwesomeIcon icon={faCheck} />
          </div>
        ) : null
      ) : null}
      <div className="license__choice-caption">{caption}</div>
      <div className="license__choice-price">${price}</div>
      <div className="license__choice-desc">{desc}</div>
      <div className="popup">{popup}</div>
    </button>
  );
}

function LicenseTypeModal(props) {
  const { isLoading, licenses } = useSelector((state) => state.licensesReducer);
  const { show } = props;
  const { setOpen } = props;

  const captions = useMemo(() => ['mp3 lease', 'wav lease', 'track out lease', 'unlimited lease', 'exclusive'], []);
  const desc = useMemo(
    () => [
      'MP3',
      'MP3 AND WAV',
      'MP3, WAV AND TRACK STEMS',
      'MP3, WAV AND TRACK STEMS',
      'JUST CONTACT ME ' + 'VIA CONTACT FORM OR USING ' + 'EMAIL/INSTAGRAM'
    ],
    []
  );
  const popups = useMemo(() => ['CLICK TO ADD IN YOUR CART', 'CLICK TO GO TO CONTACT PAGE'], []);
  const imageUrl = useMemo(() => process.env.REACT_APP_BACKEND_ASSET_URL + props.track.imgUrl, [props.track]);

  if (isLoading) {
    return <SpinnerAudio />;
  }

  return (
    <TransitionablePortal open={show} transition={{ animation: 'zoom', duration: 350 }}>
      <Modal
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
        open
        size="small"
        centered
      >
        <Modal.Content
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="licenses-container"
          onBlur={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="licenses-container">
            <Row className="track-description-container">
              <Col xl={1} md={2} sm={2} className="license__img-container">
                <img className="license__img-main" src={imageUrl} alt="track" />
              </Col>
              <Col xl={6} md={4} sm={4} className="license__beat_information">
                <div className="license__beat-name">
                  <span className="license__green">Track name:</span> {props.track.title}
                </div>
                <div className="license__author-name">
                  <span className="license__green">Producer:</span> Cherries
                </div>
                <div className="license__tags-container">
                  <span>Tags:</span>{' '}
                  {props.track.tags.map((tag, i) => (
                    <span key={i} className="tag">
                      #{tag}
                      &nbsp;
                    </span>
                  ))}
                </div>
                <div className="license__bpm">
                  <span className="license_bpm-caption">BPM: </span> {props.track.bpm}
                </div>
              </Col>
            </Row>
            <Row>
              <Col xl={3} md={4} sm={12}>
                <ToCartButton
                  licenseType={licenses[3].type}
                  price={licenses[3].price}
                  caption={licenses[3].label.toLowerCase()}
                  desc={desc[0]}
                  popup={popups[0]}
                  setOpen={() => {
                    setOpen(false);
                  }}
                  isInCart={props.isInCart}
                  licenseId={licenses[3].id}
                  trackId={props.track.id}
                />
              </Col>
              <Col xl={3} md={4} sm={12}>
                <ToCartButton
                  licenseType={licenses[2].type}
                  price={licenses[2].price}
                  caption={licenses[2].label.toLowerCase()}
                  desc={desc[1]}
                  popup={popups[0]}
                  setOpen={() => {
                    setOpen(false);
                  }}
                  isInCart={props.isInCart}
                  licenseId={licenses[2].id}
                  trackId={props.track.id}
                />
              </Col>
              <Col xl={3} md={4} sm={12}>
                <ToCartButton
                  licenseType={licenses[1].type}
                  price={licenses[1].price}
                  caption={licenses[1].label.toLowerCase()}
                  desc={desc[2]}
                  popup={popups[0]}
                  setOpen={() => {
                    setOpen(false);
                  }}
                  isInCart={props.isInCart}
                  licenseId={licenses[1].id}
                  trackId={props.track.id}
                />
              </Col>
              <Col xl={3} md={6} sm={12}>
                <ToCartButton
                  licenseType={licenses[0].type}
                  price={licenses[0].price}
                  caption={licenses[0].label.toLowerCase()}
                  desc={desc[3]}
                  popup={popups[0]}
                  setOpen={() => {
                    setOpen(false);
                  }}
                  isInCart={props.isInCart}
                  licenseId={licenses[0].id}
                  trackId={props.track.id}
                />
              </Col>

              <Col xl={12} md={6} sm={12}>
                <ToCartButton
                  licenseType={5}
                  price="~"
                  caption={captions[4]}
                  desc={desc[4]}
                  popup={popups[1]}
                  setOpen={() => {
                    setOpen(false);
                  }}
                />
              </Col>
            </Row>
          </div>
        </Modal.Content>
        <Modal.Actions onClick={(e) => e.stopPropagation()}>
          <Button
            basic
            className="license__choice-close-button"
            inverted
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            <div className="license__close-button-icon">
              <FontAwesomeIcon icon={faTimes} /> Close
            </div>
          </Button>
        </Modal.Actions>
      </Modal>
    </TransitionablePortal>
  );
}

export default LicenseTypeModal;
