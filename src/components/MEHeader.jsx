import React from "react";
import { useSelector } from "react-redux";
import meColors from "./meColors";

function MEHeader(props) {
  const darkMode = useSelector(state => state.coreUi.darkMode);
  const {
    children,
    className,
    icon,
    margin,
    padding,
    borderRadius,
    backgroundDark,
    backgroundLight
  } = props;

  return (
    <div
      className={`w-100 d-flex`}
      style={{
        padding: padding || "24px",
        margin: margin || "0 0 24px 0",
        borderRadius: borderRadius || "4px",
        background: darkMode
          ? backgroundDark || meColors.primary.dark
          : backgroundLight || meColors.primary.lighter
      }}
    >
      {icon && (
        <div
          className="p-3 rounded mr-4"
          style={{
            background: meColors.primary.main
          }}
        >
          {icon({
            style: {
              color: "white",
              width: "24px",
              height: "24px"
            }
          })}
        </div>
      )}
      <div
        className={className}
        style={{ height: "fit-content", width: "100%" }}
      >
        {children}
      </div>
    </div>
  );
}

export default MEHeader;
