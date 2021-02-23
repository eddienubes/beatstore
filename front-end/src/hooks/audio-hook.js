// import {useCallback, useContext} from "react";
// import AudioInstanceContext from "../components/audio-instance-context";
// import {useSelector} from "react-redux";
//
// const useAudio = (track, index) => {
//     const {isPlaying, id} = useSelector(state => state.audioReducer);
//     const {audioInstance} = useContext(AudioInstanceContext).state;
//
//     const onPlay = useCallback(() => {
//         if (track.id === id && !isPlaying) {
//             audioInstance.play();
//         }
//         else if (track.id === id && isPlaying) {
//             console.log('here')
//             audioInstance.pause();
//         }
//         else if (index === 0 && !id && !isPlaying) {
//             audioInstance.play();
//         }
//         else {
//             audioInstance.playByIndex(index);
//         }
//     }, [audioInstance])
//
//     return [onPlay, id];
// }
//
// export default useAudio;