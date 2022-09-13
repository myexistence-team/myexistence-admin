import { store } from "src/store/reducers/rootReducer";

export function getOrdered(stateName, ids) {
  return store.getState().firestore.ordered[stateName];
}

export function getProfile() {
  return store.getState().firebase.profile;
}

export function getData(name, id) {
  return store.getState().firestore.data[name]?.[id];
}

export function getCurrentScheduleTime() {
  const nowScheduleDate = new Date();
  const now = new Date();
  nowScheduleDate.setDate(now.getDay() + 4);
  nowScheduleDate.setFullYear(1970);
  nowScheduleDate.setMonth(0);
  return nowScheduleDate;
}