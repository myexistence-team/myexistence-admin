import { useSelector } from "react-redux";
import { useMemo } from "react";

/**
 * Map ids to resources from redux store.
 * @param {string} reducerName
 * @param {string[]} ids
 */
export default function useResourceMapper(reducerName, ids) {
  const reducer = useSelector((state) => state[reducerName]);

  if (!reducer) {
    throw new Error(`Reducer ${reducerName} does not exist.`);
  }
  const idsAsString = JSON.stringify(ids);
  return useMemo(() => {
    return (ids || [])
      .map((id) => reducer[id])
      .filter((r) => r !== null && r !== undefined); // eslint-disable-next-line
  }, [reducer, idsAsString]);
}
