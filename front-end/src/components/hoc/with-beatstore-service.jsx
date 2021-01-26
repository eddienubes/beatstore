import React from 'react';
import BeatstoreService from "../../services";

const withBeatstoreService = (Wrapped) => {
    const beatstoreService = new BeatstoreService();

    return (props) => {
        return (
            <Wrapped {...props} beatstoreService={beatstoreService}/>
        );
    };
};

export default withBeatstoreService;