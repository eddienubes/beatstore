import React, { useMemo } from 'react';
import './current-track.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { audioLoaded, audioPlayed, audioStopped, filterSearchSet } from '../../redux/actions';
import ToCartButton from '../to-cart-button';
import DownloadButton from '../download-button';
import { filter } from '../../redux/actions/actions';
import { PRODUCER_NAME } from '../../constants/content';

function CurrentTrack({ track, color }) {
  const { id, isPlaying } = useSelector((state) => state.audioReducer);
  const { cart } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const history = useHistory();

  const isInCart = useMemo(() => cart.items.find((i) => i.beatId._id.toString() === track?.id?.toString()), [cart.items]);

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

  const imageUrl = process.env.REACT_APP_BACKEND_ASSET_URL + track.imgUrl;

  const dateObj = new Date(track.loadTime);
  const month = dateObj.getUTCMonth() + 1; // months from 1-12
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();

  const date = `${year}/${month}/${day}`;

  return (
    <div className="current-track-container">
      <div className="img-container-featured" style={{ background: `linear-gradient(${color}, black)` }} />
      <div className="content">
        <div className="content-img-container-featured">
          <img src={imageUrl} alt="featured track" />
          <div className="icon-play-container" onClick={handlePlay}>
            <FontAwesomeIcon className="icon-play" icon={id === track.id && isPlaying ? faPause : faPlay} />
          </div>
        </div>
        <div className="info">
          <p className="title">{track.title}</p>
          <p className="author">✍ {PRODUCER_NAME}</p>
          <p className="date">
            🕒
            {date}
          </p>
          <div className="footer">
            <ToCartButton isInCart={isInCart} track={track} />
            <DownloadButton id={track.id} fileName={track.title} />
            <div className="tags-container">
              {track.tags.map((t, index) => {
                if (index < 3) {
                  return (
                    <p
                      key={index + t + track.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(filterSearchSet(e.target.innerText));
                        dispatch(filter(undefined, Math.floor(window.innerHeight / 65)));
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
    </div>
  );
}

export default CurrentTrack;
