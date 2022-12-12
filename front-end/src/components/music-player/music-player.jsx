import React, { useContext, useEffect, useRef, useState } from 'react';
import 'react-jinke-music-player/assets/index.css';
import 'react-jinke-music-player/lib/styles/index.less';
import { useDispatch, useSelector } from 'react-redux';
import ReactPlayer from 'react-player';
import { withStyles } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import { faPause, faPlay, faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons';
import { Repeat, RepeatOne, VolumeDown, VolumeUp } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ErrorIndicator from '../error-indicator';
import BeatstoreService from '../../services';
import AudioInstanceContext from '../audio-instance-context';
import { audioLoaded, audioPlayed, audioStopped } from '../../redux/actions';

import './music-player.scss';
import SpinnerAudio from '../spinner-audio';

const PrettoSlider = withStyles({
  root: {
    color: '#00FFF9',
    height: 8
  },
  thumb: {
    transition: '.2s ease-in-out',
    height: 15,
    width: 15,
    backgroundColor: '#00FFF9',
    border: '2px solid #00FFF9',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit'
    }
  },

  active: {},
  valueLabel: {
    left: 'calc(-50% - 4px)',
    '& *': {
      background: 'transparent',
      fontWeight: 'bold'
    },
    borderRadius: 0
  },
  track: {
    transition: '.2s ease-in-out',
    height: 2,
    width: '100%'
  },
  rail: {
    background: 'black',
    height: 2
  }
})(Slider);

const VolumeSlider = withStyles({
  root: {
    color: '#00FFF9',
    height: 8
  },
  thumb: {
    height: 15,
    width: 15,
    backgroundColor: '#00FFF9',
    border: '2px solid #00FFF9',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit'
    }
  },

  active: {},
  valueLabel: {
    left: 'calc(-50% - 4px)',
    '& *': {
      background: 'transparent',
      fontWeight: 'bold'
    },
    borderRadius: 0
  },
  track: {
    height: 2,
    width: '100%'
  },
  rail: {
    background: 'black',
    height: 2
  }
})(Slider);

function MusicPlayer() {
  // // loadFile = async () => {
  // //     const response = await axios.get('http://localhost:5000/beat', {
  // //         responseType: 'blob',
  // //         headers: {
  // //             'Content-Type': 'audio/mp3',
  // //         },
  // //     });
  // //     const blob = new Blob([response.data], {type: 'audio/mp3'});
  // //     const url = URL.createObjectURL(blob);
  // //     if (!this.state.url) {
  // //         this.load(url);
  // //     }
  // // }

  // redux states
  const { id, isPlaying, previousId } = useSelector((state) => state.audioReducer);
  const { beatList, latestBeats } = useSelector((state) => state.beatsReducer);
  const dispatch = useDispatch();

  // context audio instance
  const audio = useContext(AudioInstanceContext);

  // audio player states
  const [playerState, setPlayerState] = useState({
    duration: 0,
    loop: false,
    seeking: false,
    volume: 0.8,
    url: null,
    imgUrl: null,
    title: null,
    error: null,
    index: null,
    audioList: [],
    show: false,
    loading: false,
    played: 0,
    loaded: 0
  });

  const playerInstanceRef = useRef(null);

  // audio instance
  const playerRef = (player) => {
    playerInstanceRef.current = player;
    audio.updateValue.setAudioInstance(player);
  };

  // handle player and pause
  const handlePlay = () => {
    console.log('onPlay');
    dispatch(audioPlayed());
  };

  const handlePause = () => {
    dispatch(audioStopped());
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      dispatch(audioStopped());
    } else {
      dispatch(audioPlayed());
    }
  };

  // handle seek on mouse down event
  const handleSeekMouseDown = (e) => {
    setPlayerState((playerState) => ({
      ...playerState,
      seeking: !playerState.seeking
    }));
  };

  // handle seek when its value has changed
  const handleSeekChange = (e, value) => {
    handleSeekMouseDown(e);
    setPlayerState((playerState) => ({
      ...playerState,
      seeking: !playerState.seeking,
      played: parseFloat(value)
    }));
  };

  // change value when mouse button is released
  const handleSeekMouseUp = (e, value) => {
    const played = parseFloat(value);

    setPlayerState((playerState) => ({
      ...playerState,
      played
    }));
    playerInstanceRef.current.seekTo(played);
  };

  const handleAudioProgress = (state) => {
    // console.log('onProgress', state);

    if (!playerState.seeking) {
      setPlayerState((playerState) => ({
        ...playerState,
        played: state.playedSeconds,
        loaded: state.loadedSeconds
      }));
    }
  };

  // handle case when audio is ended, so we should either continue playing the same song or stop
  const handleEnded = () => {
    console.log('onEnded HERE');

    if (playerState.loop) {
      dispatch(audioPlayed());
    } else if (playerState.index + 1 < playerState.audioList.length) {
      // dispatch(audioLoaded(playerState.audioList[playerState.index + 1].id));
      handleStepForward();
    } else {
      dispatch(audioStopped());
    }
  };

  // handle duration state of the player itself
  const handleDuration = (duration) => {
    // console.log('onDuration', duration);

    setPlayerState((playerState) => ({
      ...playerState,
      duration
    }));
  };

  const handleLoop = (e) => {
    setPlayerState((playerState) => ({
      ...playerState,
      loop: !playerState.loop
    }));
  };

  const handleVolumeChange = (e, value) => {
    setPlayerState((playerState) => ({
      ...playerState,
      volume: parseFloat(value)
    }));
  };

  const handleStepForward = (e) => {
    const newIndex = playerState.index + 1;
    if (newIndex >= playerState.audioList.length) return;

    dispatch(audioLoaded(playerState.audioList[newIndex].id));
  };
  const handleStepBackward = (e) => {
    const newIndex = playerState.index - 1;
    if (newIndex < 0) return;

    dispatch(audioLoaded(playerState.audioList[newIndex].id));
  };

  useEffect(() => {
    const baseUrl = process.env.REACT_APP_BACKEND_ASSET_URL;
    const beatstoreService = new BeatstoreService();

    if (beatList.length > 0 && id) {
      setPlayerState((playerState) => ({
        ...playerState,
        audioList: beatList,
        index: beatList.findIndex((a) => a.id === id)
      }));
    }

    if (id) {
      setPlayerState((playerState) => ({
        ...playerState,
        loading: true,
        played: 0,
        loaded: 0
      }));
      beatstoreService
        .getBeatById(id)
        .then(({ data }) => {
          const itsUrl = baseUrl + data.beat.previewAudioUrl.replaceAll('\\', '/');
          const imageUrl = process.env.REACT_APP_BACKEND_ASSET_URL + data.beat.imgUrl;

          setPlayerState((playerState) => ({
            ...playerState,
            url: itsUrl,
            imgUrl: imageUrl,
            title: data.beat.title,
            loading: false
          }));
        })
        .catch((error) => {
          setPlayerState((playerState) => ({
            ...playerState,
            error,
            loading: false
          }));
        });
    }
  }, [id]);

  useEffect(() => {
    if (playerState.audioList.length > 0) {
      setPlayerState((playerState) => ({
        ...playerState,
        show: true
      }));
    }
  }, [playerState.audioList]);

  const player =
    playerState.show || id ? ( // TODO AND NEW WRAPPER WITH ON ANIMATION END EVENT
      <div className="music-player__container">
        <div className="progress-bar">
          <PrettoSlider
            min={0}
            max={playerState.duration}
            defaultValue={0}
            value={playerState.played}
            valueLabelDisplay="auto"
            aria-label="pretto slider"
            valueLabelFormat={(value) => {
              const minutesInt = Math.floor(value / 60);
              const secondsInt = Math.floor(value % 60);

              const formattedMinutes = minutesInt < 10 ? `0${String(minutesInt)}` : String(minutesInt);
              const formattedSeconds = secondsInt < 10 ? `0${String(secondsInt)}` : String(secondsInt);
              return <div className="seconds-display">{`${formattedMinutes}:${formattedSeconds}`}</div>;
            }}
            onChange={handleSeekChange}
            onChangeCommitted={handleSeekMouseUp}
          />
        </div>
        <div className="main-content">
          <div className="information-container">
            <div className="image-container">
              <img src={playerState.imgUrl} alt="beat" />
            </div>
            <div className="title-container">
              <div className="title">{playerState.title}</div>
              <div className="author">Cherries By</div>
            </div>
          </div>
          {playerState.loading ? (
            <SpinnerAudio />
          ) : (
            <div className="player-buttons">
              <div className="repeat" onClick={handleLoop}>
                {playerState.loop ? <RepeatOne /> : <Repeat />}
              </div>
              <div className="step-backward" onClick={handleStepBackward}>
                <FontAwesomeIcon icon={faStepBackward} />
              </div>
              <div className="play" onClick={handlePlayPause}>
                <FontAwesomeIcon className="icon" icon={isPlaying ? faPause : faPlay} />
              </div>
              <div className="step-forward" onClick={handleStepForward}>
                <FontAwesomeIcon icon={faStepForward} />
              </div>
              <div className="repeat" style={{ visibility: 'hidden' }}>
                {playerState.loop ? <RepeatOne /> : <Repeat />}
              </div>
            </div>
          )}
          <div className="player-actions">
            <div className="volume">
              <VolumeDown />
              <VolumeSlider
                className="slider"
                min={0}
                max={1}
                step={0.01}
                value={playerState.volume}
                onChange={handleVolumeChange}
                onChangeCommitted={handleVolumeChange}
                valueLabelDisplay="off"
                aria-label="pretto slider"
              />
              <VolumeUp />
            </div>
          </div>
        </div>
      </div>
    ) : null;

  if (playerState.error) {
    return <ErrorIndicator />;
  }

  return (
    <div>
      <div className="player-wrapper">
        <ReactPlayer
          ref={playerRef}
          className="react-player"
          width="100%"
          height="100%"
          url={playerState.url}
          playing={isPlaying}
          loop={playerState.loop}
          volume={playerState.volume}
          onReady={() => console.log('onReady')}
          onStart={() => console.log('onStart')}
          onBuffer={() => console.log('onBuffer')}
          onSeek={(e) => console.log('onSeek', e)}
          onEnded={handleEnded}
          onError={(e) => {
            setPlayerState((playerState) => ({
              ...playerState,
              error: e
            }));
          }}
          onProgress={handleAudioProgress}
          onDuration={handleDuration}
        />
      </div>
      {player}
    </div>
  );
}

export default MusicPlayer;
