import { CSpinner } from "@coreui/react";
import classNames from "classnames";
import React from "react";
import { Helmet } from "react-helmet";

export default function MESpinner(props) {
  function getSize(size) {
    switch (size) {
      case "large":
        return { width: "3rem", height: "3rem" };
      case "small":
        return { width: "1rem", height: "1rem" };
      default:
        return { width: "2rem", height: "2rem" };
    }
  }
  return (
    <div
      className={classNames("text-center py-5 w-100", props.className)}
      style={{
        ...props.style,
        height: props.style?.height || "fit-content"
      }}
      {...props}
    >
      <Helmet>
        <title>Loading...</title>
      </Helmet>
      <CSpinner color="primary" style={getSize(props.size)} />
    </div>
  );
}
