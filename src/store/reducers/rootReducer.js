import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import coreUiReducer from "./coreUiReducer";
import { firebaseReducer, authReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";
import thunk from "redux-thunk";
import { getFirestore } from 'redux-firestore';
import { getFirebase } from 'react-redux-firebase';
import persistStore from "redux-persist/es/persistStore";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "coreUi"],
};

const rootReducer = combineReducers({
  coreUi: coreUiReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  auth: authReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(
  persistedReducer,
  compose(
    applyMiddleware(
      thunk.withExtraArgument({
        getFirebase, 
        getFirestore
      })
    ),
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
  ),
);

export const persistor = persistStore(store)
