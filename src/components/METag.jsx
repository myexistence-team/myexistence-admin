import { CBadge } from "@coreui/react";
import React from "react";
import useQueryString from "src/hooks/useQueryString";
import { object, string } from "yup";

export default function METag(props) {
  const [query, setQueryStr] = useQueryString(
    object().shape({
      tags: string().default("")
    })
  );

  function handleTagsChange(tags) {
    setQueryStr({
      ...query,
      tags
    });
  }
  return (
    <CBadge
      style={{
        backgroundColor: "#A1DCBC",
        color: "#191919",
        cursor: props.disabled ? "auto" : "pointer"
      }}
      onClick={() => !props.disabled && handleTagsChange(props.id)}
    >
      #{props.children}
    </CBadge>
  );
}
