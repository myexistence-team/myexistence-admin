import React from "react";
import KKTag from "./METag";

export default function METagGroup(props) {
  return (
    <div
      className={props.className}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 4
      }}
    >
      {props.tags
        ? props.tags.map((tag, idx) => (
            <KKTag
              key={idx}
              disabled={props.disabled !== undefined ? props.disabled : false}
              id={tag.id}
            >
              {tag.name}
            </KKTag>
          ))
        : props.children}
    </div>
  );
}
