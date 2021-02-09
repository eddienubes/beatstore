import {createStore} from "redux";
import {composeWithDevTools, devToolsEnhancer} from "redux-devtools-extension";
import rootReducer from './reducers';
import {applyMiddleware} from "redux";
import thunk from "redux-thunk";



const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;