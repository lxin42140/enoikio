import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import burgerReducer from "./store/reducers/burgerBuilder";
import orderReducer from "./store/reducers/order";
import authReducer from "./store/reducers/auth";

// const rootReducer = combineReducers({
//   burgerBuilder: burgerReducer,
//   order: orderReducer,
//   auth: authReducer
// });

const composeEnhancer = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : null;

// const store = createStore(rootReducer, composeEnhancer(applyMiddleware(thunk)));

const app = (
  //<Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  //</Provider>
);

ReactDOM.render(app, document.getElementById("root"));
registerServiceWorker();
