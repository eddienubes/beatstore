import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { audioLoaded, audioPlayed, audioStopped } from '../redux/actions';
import audioReducer from '../redux/reducers/audio-reducer';

const useAudio = (track, index) => {
  const { id, isPlaying } = useSelector((state) => state.audioReducer);
  const dispatch = useDispatch();

  const onClick = useCallback(
    (e) => {
      e.stopPropagation();

      if (track.id === id && isPlaying) {
        dispatch(audioStopped());
      } else if (track.id !== id) {
        dispatch(audioLoaded(track.id));
      } else if (track.id === id && !isPlaying) {
        dispatch(audioPlayed());
      }
    },
    [track, index, id, isPlaying]
  );

  return [id, isPlaying, onClick];
};

export default useAudio;
