import qs from "qs";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import buildQueryStr from "src/utils/buildQueryStr";

export default function useQueryString(qsSchema, watch) {
  const history = useHistory();
  const location = useLocation();
  const search = location.search.replace("?", "");
  let query;

  try {
    query = qsSchema.cast(qs.parse(search));
  } catch (err) {
    console.log(err);
    history.replace("/404");
  }
  /**
   * Sets the Query String.
   * @param {object} args dictionary of params to args.
   */
  function setQueryStr(args) {
    history.push(buildQueryStr(location.pathname, args));
  }

  function makeQueryStrWith(args) {
    const queryClauses = Object.entries(args).map(
      ([param, arg]) => `${param}=${encodeURIComponent(arg)}`
    );

    return `${location.pathname}?${queryClauses.join("&")}`;
  }

  useEffect(() => {
    if (watch) {
      const subscription = watch(value => {
        setQueryStr({
          ...query,
          ...value
        });
      });
      return () => subscription.unsubscribe();
    }
  }, [watch]);

  return [query, setQueryStr, qsSchema, makeQueryStrWith];
}
