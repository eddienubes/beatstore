import React from 'react';

const withPlayables = (Wrapped) => {
    const audio = {};
    const setSelectedTrack = () => {};
    const setPreviousTrack = () => {};

    //const audio = useSelector(state => state.audio);
    // const setSelectedTrack = useCallback((payload) =>
    //         dispatch(actions.setSelectedTrack(payload)),
    //     [track]);
    //
    //
    // const setPreviousTrack = useCallback((payload) =>
    //         dispatch(actions.setPreviousTrack(payload)),
    //     [track]);

    const playBack = () => {
        // if (audio.selectedTrack === track.id) {
        //     setSelectedTrack(null);
        //     setPreviousTrack(track.id);
        //
        // } else {
        //     setSelectedTrack(track.id);
        //     setPreviousTrack(audio.selectedTrack);
        // }
        //
        // audio.audioInstance.play();
    }

    return (props) => {

        return (
            <Wrapped {...props}
                     setSelectedTrack={setSelectedTrack}
                     setPreviousTrack={setPreviousTrack}
                     playBack={playBack}
                     audio={audio}
            />
        );
    };
}

export default withPlayables;