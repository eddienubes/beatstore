import React from 'react';
import ErrorBoundary from "./components/error-boundary";
import RoutingContainer from "./containers/routing-container/routing-container";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'semantic-ui-css/semantic.min.css';
import BeatstoreService from "./components/beatstore-service-context";
import {withBeatstoreService} from './components/hoc';

const App = ({beatstoreService}) => {

    return (
        <ErrorBoundary>
            <BeatstoreService.Provider value={beatstoreService}>
                <RoutingContainer/>
            </BeatstoreService.Provider>
        </ErrorBoundary>
    );
};

export default withBeatstoreService(App);