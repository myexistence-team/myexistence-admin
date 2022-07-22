import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import meToaster from "src/components/toaster";

/**
 * Calls the backend api.
 * @returns {Object}.
 * @param {function} actionCreator
 */
export default function useFromApi(
  actionCreator,
  dependencyList = [],
  conditional = () => true,
  isConcat = false,
  resetDependencies = []
) {
  const [loading, setLoading] = useState(true);
  // Temporary sortOrder
  const [tempSortOrder, setTempSortOrder] = useState([]);
  // Main sortOrder that will be used
  const [sortOrder, setSortOrder] = useState([]);
  const [error, setError] = useState(undefined);
  const [count, setCount] = useState(0);

  const [refreshState, setRefreshState] = useState(true);

  const dispatch = useDispatch();

  function refresh() {
    setRefreshState(!refreshState);
  }

  useEffect(() => {
    if (conditional()) {
      setLoading(true);
      dispatch(actionCreator)
        .then(res => {
          if (isConcat) {
            setTempSortOrder(res.data?.map(resource => resource.id));
          } else {
            setSortOrder(res.data?.map(resource => resource.id));
          }
          if (res.count) {
            setCount(res.count);
          }
        })
        .catch(err => {
          meToaster.danger(err.msg);
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [dispatch, conditional(), refreshState, ...dependencyList]);

  // resetDependencies list will reset the sortOrder
  useEffect(() => {
    setSortOrder([]);
  }, [dispatch, ...resetDependencies]);

  // Listen to changes to the temporary sortOrder,
  // then apply it accordingly
  useEffect(() => {
    // Concatinate to previous sortOrder
    setSortOrder(sortOrder.concat(tempSortOrder));
  }, [tempSortOrder]);

  /**
   * Loading tells whether call is still loading.
   * sortOrder tells the order of the resource's ids in data (not in included).
   * error is an object that contains the error from makeRequestThunkApi.
   * done tells whether or not the response has been returned.
   * refresh is a function that redo the API call
   */
  return { loading, sortOrder, error, refresh, count };
}
