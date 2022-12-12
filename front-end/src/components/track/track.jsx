import React, { useContext, useEffect, useMemo, useState } from 'react';
import './track.scss';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import LicenseTypeModal from '../license-type-modal';
import { audioLoaded, audioPlayed, audioStopped, filterSearchSet } from '../../redux/actions';
import AudioInstanceContext from '../audio-instance-context';
import { filter } from '../../redux/actions/actions';
import ToCartButton from '../to-cart-button';
import useTraceUpdate from '../../hooks/trace-updates-hook';
import TrackTitle from '../track-title';

function Track({ track, onSelected, index, id, previousId, isPlaying, cartItems }) {
  const [isActive, setActive] = useState(false);
  const dispatch = useDispatch();
  const { audioInstance } = useContext(AudioInstanceContext).state;
  const history = useHistory();

  useEffect(() => {
    if (track.id === id && isPlaying) {
      setActive(true);
    } else if (track.id === id && !isPlaying) {
      setActive(false);
    } else {
      setActive(false);
    }
  }, [id, isPlaying]);

  const isInCart = cartItems.find((i) => i.beatId._id.toString() === track.id.toString());

  const onClick = (e) => {
    e.stopPropagation();

    if (track.id === id && isPlaying) {
      dispatch(audioStopped());
    } else if (track.id !== id) {
      dispatch(audioLoaded(track.id));
    } else if (track.id === id && !isPlaying) {
      dispatch(audioPlayed());
    }
  };

  const imageUrl = useMemo(() => process.env.REACT_APP_BACKEND_ASSET_URL + track.imgUrl, [track]);

  return (
    <Table.Row className={`main-row-track ${isActive ? 'selected_tr' : null}`} onClick={onClick}>
      <Table.Cell className="tracks__title">
        <div className="track__td-img">
          <img className="td-img-main" src={imageUrl} alt="beat" />
        </div>
        <TrackTitle title={track.title} id={track.id} />
      </Table.Cell>
      <Table.Cell>{track.duration}</Table.Cell>
      <Table.Cell>{track.bpm}</Table.Cell>
      <Table.Cell className="tracks__scale">{track.scale}</Table.Cell>
      <Table.Cell className="track__tags">
        <div className="tags-container">
          {track.tags.map((tag, i) => (
            <b
              key={i}
              className="track__tag"
              onClick={(e) => {
                e.stopPropagation();
                // dispatch(filterDropped());
                dispatch(filterSearchSet(e.target.innerText));
                dispatch(filter(undefined, Math.floor(window.innerHeight / 65)));
                history.push('/beats');
              }}
            >
              #{tag}
            </b>
          ))}
        </div>
      </Table.Cell>
      <Table.Cell className="tracks__button-buy">
        <ToCartButton isInCart={isInCart} track={track} />
      </Table.Cell>
    </Table.Row>
  );
}

export default React.memo(Track, (prevProps, nextProps) => {
  const trackId = prevProps.track.id;

  console.log(
    nextProps.cartItems.some(
      (i) => i.beatId._id.toString() === trackId.toString(),
      prevProps.cartItems.some((i) => i.beatId._id.toString() === trackId.toString())
    )
  );

  const newCartItem = nextProps.cartItems.find((i) => i.beatId._id.toString() === trackId.toString());
  const oldCartItem = prevProps.cartItems.find((i) => i.beatId._id.toString() === trackId.toString());

  if (newCartItem && oldCartItem && newCartItem.licenseId._id !== oldCartItem.licenseId._id) {
    return false;
  }

  if (
    nextProps.cartItems.some((i) => i.beatId._id.toString() === trackId.toString()) !==
    prevProps.cartItems.some((i) => i.beatId._id.toString() === trackId.toString())
  ) {
    return false;
  }

  return trackId !== nextProps.id && trackId !== nextProps.previousId;
});
