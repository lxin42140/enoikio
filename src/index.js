import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";

import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import ListingReducer from "./store/reducers/Listings";
import NewPostReducer from "./store/reducers/newPost";
import AuthReducer from "./store/reducers/Auth";
import ChatReducer from "./store/reducers/Chat";
import RequestReducer from './store/reducers/Requests';
import SearchReducer from './store/reducers/Search';
import WindowReducer from './store/reducers/Window';

const rootReducer = combineReducers({
  listing: ListingReducer,
  newPost: NewPostReducer,
  auth: AuthReducer,
  chat: ChatReducer,
  request: RequestReducer,
  search: SearchReducer,
  window: WindowReducer,
});

const composeEnhancers =
  (process.env.NODE_ENV === "development"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null) || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
registerServiceWorker();
