import { camelCase } from "change-case";
import meToaster from "src/components/toaster";

const localStorageKey = "me-web-token";

export const HTTP_METHODS = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete"
};

export const ACTION_TYPES = {
  MERGE: "merge",
  REPLACE: "replace"
};

export const makeApiRequestThunk = (
  method,
  url,
  payload,
  actionType
) => dispatch => {
  dispatch({
    type: `api/request ${url}`,
    token: localStorage.getItem(localStorageKey),
    payload: payload ? undefined : payload,
    actionType,
    method,
    url
  });

  const body =
    payload &&
    JSON.stringify({
      data: {
        attributes: payload
      }
    });

  const authorizationToken = localStorage.getItem(localStorageKey);

  return fetch(`/api/v1${url}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: authorizationToken
    },
    method,
    body
  }).then(response => {
    dispatch({
      type: `api/receive ${url}`
    });

    return response.text().then(rawBody => {
      let body = rawBody;
      try {
        body = JSON.parse(rawBody);
      } catch (e) {
        // keep the body raw
      }

      if (response.status === 401) {
        localStorage.clear();
        if (!window.location.href.includes("/login")) {
          window.location.replace("/login");
        }
      }

      // If response !== 2XX.
      if (response.status < 200 || response.status >= 300) {
        let msg = "";
        if (
          response.status === 500 ||
          response.headers.get("content-type").includes("text/html")
        ) {
          msg = "Internal error. Please contact support to resolve this issue.";
        } else {
          console.error(body.error.description);
          msg = body.error.description;
        }

        // meToaster.danger(msg);
        dispatch({
          type: "api/error",
          message: msg
        });
        return Promise.reject({
          statusCode: response.status,
          msg
        });
      }

      if (response.headers.get("authorization")) {
        localStorage.setItem(
          localStorageKey,
          response.headers.get("authorization")
        );
      }

      if (!Array.isArray(body.data) || !Array.isArray(body.included)) {
        throw new Error(
          `Expecting body.data or body.included to be an array, but rather a ${body.data} and ${body.included}.`
        );
      }

      function dispatchData(data) {
        const types = collectTypesFromData(data);

        types.forEach(type => {
          const entities = data.filter(entity => entity.type === type);

          const entityMap = entities.reduce((acc, entity) => {
            return {
              ...acc,
              [entity.id]: entity.attributes
            };
          }, {});

          dispatch({
            // type: `${pluralize(camelCase(type))}/${actionType}`,
            type: `${camelCase(type)}/${actionType}`,
            payload: entityMap
          });
        });
      }

      dispatchData(body.data);
      dispatchData(body.included);

      return Promise.resolve(body);
    });
  });
};

function collectTypesFromData(data) {
  return data.reduce((acc, entity) => {
    if (!acc.includes(entity.type)) {
      acc.push(entity.type);
    }
    return acc;
  }, []);
}

const makeApiRequest = {
  makeApiRequestThunk,
  HTTP_METHODS
};

export default makeApiRequest;
