import React, {useContext, useEffect, useRef, useState} from 'react';
import 'react-jinke-music-player/assets/index.css';
import 'react-jinke-music-player/lib/styles/index.less'
import {useDispatch, useSelector} from "react-redux";
import {audioLengthLoaded, audioLengthPlayed, audioLoaded, audioPlayed, audioStopped} from "../../redux/actions";
import AudioInstanceContext from "../audio-instance-context";
import ReactPlayer from "react-player";

import './music-player.scss';
import {withStyles} from "@material-ui/core";
import Slider from '@material-ui/core/Slider';
import BeatstoreService from "../../services";
import ErrorIndicator from "../error-indicator";
import {faPause, faPlay, faStepBackward, faStepForward} from "@fortawesome/free-solid-svg-icons";
import {Repeat, RepeatOne, VolumeDown, VolumeUp} from '@material-ui/icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {TransitionablePortal} from "semantic-ui-react";

const PrettoSlider = withStyles({
    root: {
        color: '#00FFF9',
        height: 8,
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
            boxShadow: 'inherit',
        },
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
        height: 2,
    },
})(Slider);

const VolumeSlider = withStyles({
    root: {
        color: '#00FFF9',
        height: 8,
    },
    thumb: {
        height: 15,
        width: 15,
        backgroundColor: '#00FFF9',
        border: '2px solid #00FFF9',
        marginTop: -8,
        marginLeft: -12,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },

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
        height: 2,
    },
})(Slider);


const MusicPlayer = () => {
    // const [audioInstance, setAudioInstance] = useState(null);
    // const dispatch = useDispatch();
    // const {beatsReducer, audioReducer} = useSelector(state => state);
    // const track = useRef(null);
    // const [audioList, setAudioList] = useState([]);
    // const {beatList} = beatsReducer;
    // const {id, isPlaying, previousId} = audioReducer;

    // // useEffect(() => {
    // //     if (!audioInstance) return;
    // //
    // //     if (id !== previousId) {
    // //         audioInstance.playByIndex(id - 1);
    // //         return;
    // //     }
    // //
    // //     if (id === previousId) {
    // //         audioInstance.play();
    // //     }
    // // }, [id, isPlaying, audioInstance])
    //
    //
    //
    // useEffect(() => {
    //     if (beatList.length !== 0) {
    //         setAudioList(beatList.map((track) => {
    //             const baseUrl = 'http://localhost:5000/api/';
    //             const audioUrl = baseUrl + track.previewAudioUrl.replaceAll('\\', '/');
    //             const imgUrl = baseUrl + track.imgUrl.replaceAll('\\', '/');
    //
    //             return ({
    //                 id: track.id,
    //                 name: track.title,
    //                 musicSrc: audioUrl,
    //                 cover: imgUrl
    //             });
    //         }))
    //     }
    // }, [beatList]);
    //
    // if (audioList.length === 0) {
    //     return null;
    // }
    //
    // return (
    //     <ReactJkMusicPlayer
    //         showMiniProcessBar={true}
    //         onAudioPlay={(audioInfo) => {
    //             dispatch(audioPlayed(audioInfo.id));
    //             track.current = beatList[audioInfo.playIndex];
    //         }}
    //         onAudioPause={() => {
    //             dispatch(audioStopped())
    //         }}
    //         mode={"full"}
    //         autoPlay={false}
    //         glassBg={true}
    //         audioLists={audioList}
    //         getAudioInstance={instance => {
    //             audio.updateValue.setAudioInstance(instance);
    //             setAudioInstance(instance);
    //             instance.crossOrigin = "anonymous";
    //         }}
    //     />
    //
    // );
    //
    //
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
    const {id, isPlaying, played} = useSelector(state => state.audioReducer);
    const {beatList} = useSelector(state => state.beatsReducer);
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
        audioList: null,
        show: false
    });

    const playerInstanceRef = useRef(null);

    // audio instance
    const playerRef = (player) => {
        playerInstanceRef.current = player;
        audio.updateValue.setAudioInstance(player);
    }


    // handle player and pause
    const handlePlay = () => {
        console.log('onPlay');
        dispatch(audioPlayed());
    }

    const handlePause = () => {
        dispatch(audioStopped());
    }

    const handlePlayPause = () => {
        if (isPlaying) {
            dispatch(audioStopped());
        } else {
            dispatch(audioPlayed());
        }
    }

    // handle seek on mouse down event
    const handleSeekMouseDown = e => {
        setPlayerState(playerState => {
            return {
                ...playerState,
                seeking: !playerState.seeking
            }
        });
    }

    // handle seek when its value has changed
    const handleSeekChange = (e, value) => {
        handleSeekMouseDown(e);
        setPlayerState(playerState => {
            return {
                ...playerState,
                seeking: !playerState.seeking
            }
        });
        const played = parseFloat(value);
        dispatch(audioLengthPlayed(played));
    }

    // change value when mouse button is released
    const handleSeekMouseUp = (e, value) => {
        const played = parseFloat(value);

        dispatch(audioLengthPlayed(played));
        playerInstanceRef.current.seekTo(played)
    }

    const handleAudioProgress = state => {
        // console.log('onProgress', state);

        if (!playerState.seeking) {
            dispatch(audioLengthLoaded(state.loadedSeconds));
            dispatch(audioLengthPlayed(state.playedSeconds));
        }
    }

    // handle case when audio is ended, so we should either continue playing the same song or stop
    const handleEnded = () => {
        console.log('onEnded')

        if (playerState.loop) {
            dispatch(audioPlayed());
        } else {
            dispatch(audioStopped());
        }
    }

    // handle duration state of the player itself
    const handleDuration = duration => {
        // console.log('onDuration', duration);

        setPlayerState(playerState => {
            return {
                ...playerState,
                duration
            }
        })
    }

    const handleLoop = e => {
        setPlayerState(playerState => {
            return {
                ...playerState,
                loop: !playerState.loop
            }
        })
    }

    const handleVolumeChange = (e, value) => {
        setPlayerState(playerState => {
            return {
                ...playerState,
                volume: parseFloat(value)
            }
        })
    }

    const handleStepForward = e => {
        const newIndex = playerState.index + 1;
        if (newIndex >= playerState.audioList.length)
            return;

        dispatch(audioLoaded(playerState.audioList[newIndex].id));
    }
    const handleStepBackward = e => {
        const newIndex = playerState.index - 1;
        if (newIndex < 0)
            return;

        dispatch(audioLoaded(playerState.audioList[newIndex].id));
    }

    useEffect(() => {
        const baseUrl = 'http://localhost:5000/api/';
        const beatstoreService = new BeatstoreService();

        if (beatList.length > 0) {
            setPlayerState(playerState => {
                return {
                    ...playerState,
                    audioList: beatList,
                    index: beatList.findIndex(a => a.id === id)
                }
            })
        }

        if (id) {
            setPlayerState(playerState => {
                return {
                    ...playerState,
                    show: true
                }
            })
            beatstoreService.getBeatById(id).then(({data}) => {
                const itsUrl = baseUrl + data.beat.previewAudioUrl.replaceAll('\\', '/');
                const imageUrl = 'http://localhost:5000/api/' + data.beat.imgUrl;

                setPlayerState(playerState => {
                    return {
                        ...playerState,
                        url: itsUrl,
                        imgUrl: imageUrl,
                        title: data.beat.title
                    }
                });
            });
        } else {
            setPlayerState(playerState => {
                return {
                    ...playerState,
                    show: false
                }
            })
        }
    }, [id])

    if (playerState.error) {
        return <ErrorIndicator/>
    }

    console.log(id);
    return (
        <div>
            <div className='player-wrapper'>
                <ReactPlayer
                    ref={playerRef}
                    className='react-player'
                    width='100%'
                    height='100%'
                    url={playerState.url}
                    playing={isPlaying}
                    loop={playerState.loop}
                    volume={playerState.volume}
                    onReady={() => console.log('onReady')}
                    onStart={() => console.log('onStart')}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onBuffer={() => console.log('onBuffer')}
                    onSeek={e => console.log('onSeek', e)}
                    onEnded={handleEnded}
                    onError={e => {
                        setPlayerState(playerState => {
                            return {
                                ...playerState,
                                error: e
                            };
                        })
                    }}
                    onProgress={handleAudioProgress}
                    onDuration={handleDuration}
                />
            </div>
            <TransitionablePortal open={playerState.show} transition={{animation: 'slide up', duration: 900}}>
                <div className={`music-player__container`}>
                    <div className={`progress-bar`}>
                        <PrettoSlider
                            min={0}
                            max={playerState.duration}
                            value={played}
                            valueLabelDisplay="auto"
                            aria-label="pretto slider"
                            valueLabelFormat={(value) => {
                                const minutesInt = Math.floor(value / 60);
                                const secondsInt = Math.floor(value % 60);

                                const formattedMinutes = minutesInt < 10 ? '0' + String(minutesInt) : String(minutesInt);
                                const formattedSeconds = secondsInt < 10 ? '0' + String(secondsInt) : String(secondsInt);
                                return (
                                    <div
                                        className={`seconds-display`}>{formattedMinutes + ':' + formattedSeconds}</div>);
                            }}
                            onChange={handleSeekChange}
                            onChangeCommitted={handleSeekMouseUp}
                        />
                    </div>
                    <div className={`main-content`}>
                        <div className={`information-container`}>
                            <div className={`image-container`}>
                                <img src={playerState.imgUrl} alt="beat image"/>
                            </div>
                            <div className={'title-container'}>
                                <div className={`title`}>{playerState.title}</div>
                                <div className={`author`}>Cherries By</div>
                            </div>
                        </div>

                        <div className={`player-buttons`}>
                            <div className={`repeat`} onClick={handleLoop}>
                                {playerState.loop ? <RepeatOne/> : <Repeat/>}
                            </div>
                            <div className={`step-backward`} onClick={handleStepBackward}>
                                <FontAwesomeIcon icon={faStepBackward}/>
                            </div>
                            <div className={`play`} onClick={handlePlayPause}>
                                <FontAwesomeIcon className={`icon`} icon={isPlaying ? faPause : faPlay}/>
                            </div>
                            <div className={`step-forward`} onClick={handleStepForward}>
                                <FontAwesomeIcon icon={faStepForward}/>
                            </div>
                            <div className={`repeat`}>
                                {/*{playerState.loop ? <RepeatOne/> : <Repeat/>}*/}
                            </div>
                        </div>
                        <div className={`player-actions`}>
                            <div className={`volume`}>
                                <VolumeDown/>
                                <VolumeSlider
                                    className={'slider'}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={playerState.volume}
                                    onChange={handleVolumeChange}
                                    onChangeCommitted={handleVolumeChange}
                                    valueLabelDisplay="off"
                                    aria-label="pretto slider"
                                />
                                <VolumeUp/>
                            </div>

                        </div>
                    </div>
                </div>
            </TransitionablePortal>
        </div>
    );
}

export default MusicPlayer;