import React from "react";
import { Provider } from "react-redux";
import { createReduxStore } from "./store";

export default children => (
  <Provider store={createReduxStore()}>{children}</Provider>
);
