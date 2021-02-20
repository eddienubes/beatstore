import React, {useEffect, useState} from 'react';
import ErrorBoundary from "./components/error-boundary";
import RoutingContainer from "./containers/routing-container/routing-container";
import {Provider, useDispatch} from 'react-redux';
import {login} from './redux/actions';
import store from "./redux/store";
import AudioInstanceContext from "./components/audio-instance-context";

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'semantic-ui-css/semantic.min.css';

const App = () => {
    const [audioInstance, setAudioInstance] = useState(null);
    const [source, setSource] = useState(false);

    return (
        <ErrorBoundary>
            <AudioInstanceContext.Provider value={
                {
                    state: {audioInstance, source},
                    updateValue: {
                        setAudioInstance, setSource
                    }
                }
            }>
                <Provider store={store}>
                    <RoutingContainer/>
                </Provider>
            </AudioInstanceContext.Provider>
        </ErrorBoundary>
    );
};

export default App;