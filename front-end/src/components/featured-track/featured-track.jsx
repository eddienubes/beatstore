import React, { useEffect, useMemo, useState } from 'react';
import { faPause, faPlay, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';
import BeatstoreService from '../../services';
import useTraceUpdate from '../../hooks/trace-updates-hook';
import './featured-track.scss';
import ErrorIndicator from '../error-indicator';
import { useDispatch, useSelector } from 'react-redux';
import SpinnerAudio from '../spinner-audio';
import { audioLoaded, audioPlayed, audioStopped, filterDropped, filterSearchSet } from '../../redux/actions';
import LicenseTypeModal from '../license-type-modal';
import ToCartButton from '../to-cart-button';
import TrackTitle from '../track-title';

function FeaturedTrack(props) {
  const [track, setTrack] = useState(null);
  const [error, setError] = useState(null);
  const { id, isPlaying } = useSelector((state) => state.audioReducer);
  const { cart } = useSelector((state) => state.userReducer);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const history = useHistory();

  const isInCart = useMemo(() => cart.items.find((i) => i.beatId._id.toString() === track?.id?.toString()), [cart.items]);

  useEffect(() => {
    const beatstoreService = new BeatstoreService();
    setLoading(true);
    beatstoreService
      .getRandomBeat()
      .then(({ data }) => {
        setTrack(data.beat);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setError(e);
      });
  }, []);
  // useTraceUpdate({track, loading, dispatch, show, id, isPlaying, error});
  if (error) {
    return <ErrorIndicator />;
  }

  if (loading || !track) {
    return <SpinnerAudio />;
  }

  const handlePlay = (e) => {
    e.stopPropagation();

    if (track.id === id && isPlaying) {
      dispatch(audioStopped());
    } else if (track.id !== id) {
      dispatch(audioLoaded(track.id));
    } else if (track.id === id && !isPlaying) {
      dispatch(audioPlayed());
    }
  };
  const imageUrl = `${process.env.REACT_APP_BACKEND_ASSET_URL}/${track.imgUrl}`;

  return (
    <div className="featured-track-container">
      <div className="img-container-featured">
        <img src={imageUrl} alt="featured track" />
        <div className="icon-play-container" onClick={handlePlay}>
          <FontAwesomeIcon className="icon-play" icon={id === track.id && isPlaying ? faPause : faPlay} />
        </div>
      </div>
      <div className="info">
        <p className="caption">Featured track</p>
        <p className="title">
          <TrackTitle title={track.title} id={track.id} />
        </p>
        <div className="footer">
          <ToCartButton isInCart={isInCart} track={track} />
          <div className="tags-container">
            {track.tags.map((t, index) => {
              if (index < 3) {
                return (
                  <p
                    key={index + t + track.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(filterDropped());
                      dispatch(filterSearchSet(e.target.innerText));
                      history.push('/beats');
                    }}
                  >
                    #{t}
                  </p>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedTrack;
