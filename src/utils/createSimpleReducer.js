/**
 * This function returns a simpleReducer that handles two simple action types: {domain}/merge and {domain}/replace.
 * This style is not a conventional style from redux, but rather our own convention, so there
 * is no point in searching about this design pattern online since you will not find anything
 * similar.
 *
 * name: must be uppercase snake case and plural (e.g. postTags)
 *  */
const createSimpleReducer = (name, defaultState) => (
  state = defaultState !== undefined && defaultState !== null
    ? defaultState
    : {},
  action
) => {
  switch (action.type) {
    case `${name}/merge`: {
      for (const [key, value] of Object.entries(action.payload)) {
        action.payload[key] = { ...state[key], ...value };
      }
      return Object.assign({}, state, action.payload);
    }
    case `${name}/replace`: {
      return Object.assign({}, action.payload);
    }
    default: {
      return state;
    }
  }
};

export default createSimpleReducer;
