import "react-app-polyfill/ie11"; // For IE 11 support
import "react-app-polyfill/stable";
import "core-js";
import "./polyfill";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { icons } from "./assets/icons";

import { Provider, useSelector } from "react-redux";
import { createFirestoreInstance } from 'redux-firestore';
import { isLoaded, ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { persistor, store } from "./store/reducers/rootReducer";
import { firebase } from './utils/firebase';
import moment from "moment";
import 'firebase/compat/storage';
import { PersistGate } from "redux-persist/integration/react";

React.icons = icons;

moment.locale("id");

const profileConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true,
  enableClaims: true
}

const rrfProps = {
  firebase,
  config: profileConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
}

function AuthReady(props) {
  const auth = useSelector(store => store.firebase.auth);
  if (!isLoaded(auth)) {
    return (
      <div className="pt-3 text-center">
        <div className="sk-spinner sk-spinner-pulse"></div>
      </div>
    );
  } else {
    return props.children;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ReactReduxFirebaseProvider { ...rrfProps }>
          <AuthReady>
            <App />
          </AuthReady>
        </ReactReduxFirebaseProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
