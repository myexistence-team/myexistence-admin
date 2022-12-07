import {
  CFormGroup,
  CFormText,
  CInput,
  CInputGroup,
  CInputGroupAppend,
  CInputGroupPrepend,
  CInputGroupText,
  CLabel
} from "@coreui/react";
import { capitalCase } from "change-case";
import React from "react";

const METextField = React.forwardRef((props, ref) => {
  const {
    id,
    key,
    type,
    error,
    errors,
    label,
    helperText,
    className,
    placeholder,
    startIcon,
    endIcon,
    name,
    ...rest
  } = props;

  return (
    <CFormGroup id={id} key={key} className={className}>
      {!(typeof label === "boolean" && !label) && (
        <CLabel htmlFor={name}>{label || capitalCase(name)}</CLabel>
      )}
      <CInputGroup>
        {startIcon && (
          <CInputGroupPrepend>
            <CInputGroupText>{startIcon()}</CInputGroupText>
          </CInputGroupPrepend>
        )}
        <CInput
          type={type}
          id={name}
          name={name}
          placeholder={placeholder || `Masukkan ${label || capitalCase(name)}`}
          invalid={Boolean(error || errors?.[name])}
          innerRef={ref}
          {...rest}
        />
        {endIcon && (
          <CInputGroupAppend>
            <CInputGroupText>{endIcon()}</CInputGroupText>
          </CInputGroupAppend>
        )}
      </CInputGroup>
      <CFormText className="help-block">{helperText}</CFormText>
      <CFormText color="danger" className="help-block">
        {error?.message || errors?.[name]?.message}
      </CFormText>
    </CFormGroup>
  );
});

export default METextField;
