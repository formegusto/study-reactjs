import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import RootReducer from "./store";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import createSagaMiddleware from "@redux-saga/core";
import RootSaga from "./store/saga";
import { loadableReady } from "@loadable/component";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  RootReducer,
  (window as any).__PRELOADED_STATE__,
  applyMiddleware(ReduxThunk, sagaMiddleware)
);
sagaMiddleware.run(RootSaga);

const Root = () => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

const root = document.getElementById("root");

if (process.env.NODE_ENV === "production") {
  loadableReady(() => {
    ReactDOM.hydrate(<Root />, root);
  });
} else {
  ReactDOM.render(<Root />, root);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
