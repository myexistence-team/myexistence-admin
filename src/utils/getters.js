import { store } from "src";


export function getOrdered(stateName, ids) {
  return store.getState().firestore.ordered[stateName];
}

export function getProfile() {
  return store.getState().firebase.profile;
}

export function getData(name, id) {
  return store.getState().firestore.data[name]?.[id];
}