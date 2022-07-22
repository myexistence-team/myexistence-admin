import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import coreUiReducer from "./coreUiReducer";
import { firebaseReducer, authReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "coreUi"],
};

const rootReducer = persistReducer(
  persistConfig,
  combineReducers({
    coreUi: coreUiReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    auth: authReducer
  })
)

export default rootReducer;