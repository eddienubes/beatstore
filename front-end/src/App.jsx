import React, {useState} from 'react';
import ErrorBoundary from "./components/error-boundary";
import RoutingContainer from "./containers/routing-container/routing-container";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'semantic-ui-css/semantic.min.css';
import {Provider} from 'react-redux';
import store from "./redux/store";
import AudioInstanceContext from "./components/audio-instance-context";

const App = () => {
    const [audioInstance, setAudioInstance] = useState(null);
    const [sourceSet, setSource] = useState(false);


    return (
        <ErrorBoundary>
            <AudioInstanceContext.Provider value={
                {
                    state: {audioInstance, sourceSet},
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