import { CFormGroup, CFormText, CLabel, CTextarea } from "@coreui/react";
import { capitalCase } from "change-case";
import React from "react";

const METextArea = React.forwardRef((props, ref) => {
  const {
    id,
    key,
    type,
    error,
    errors,
    register,
    label,
    helperText,
    className,
    placeholder,
    name,
    ...rest
  } = props;

  return (
    <CFormGroup id={id} key={key} className={className}>
      {!(typeof label === "boolean" && !label) && (
        <CLabel htmlFor={name}>{label || capitalCase(name)}</CLabel>
      )}
      <CTextarea
        type={type}
        id={name}
        name={name}
        placeholder={placeholder || `Enter ${label || capitalCase(name)}`}
        invalid={Boolean(error || errors?.[name])}
        innerRef={ref}
        {...rest}
      />
      <CFormText className="help-block">{helperText}</CFormText>
      <CFormText color="danger" className="help-block">
        {error?.message || errors?.[name]?.message}
      </CFormText>
    </CFormGroup>
  );
});

export default METextArea;
