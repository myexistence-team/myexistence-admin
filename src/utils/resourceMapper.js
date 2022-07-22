import store from "src/store/store";

/**
 * Map ids to resources from redux store.
 * @param {Object} state
 * @param {string[]} ids
 */
export default function resourceMapper(reducerName, ids) {
  const reduxStore = store.getState()[reducerName];
  if (!reduxStore) {
    throw new Error(`Reducer ${reducerName} does not exist.`);
  }
  return (ids || [])
    .map((id) => reduxStore[id])
    .filter((r) => r !== null && r !== undefined); // eslint-disable-next-line
}
