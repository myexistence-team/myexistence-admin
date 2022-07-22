import {
  CFormGroup,
  CFormText,
  CInputGroup,
  CInputGroupAppend,
  CInputGroupPrepend,
  CInputGroupText,
  CLabel,
  CSelect
} from "@coreui/react";
import { capitalCase } from "change-case";
import React from "react";

const MENativeSelect = React.forwardRef((props, ref) => {
  const {
    id,
    key,
    type,
    error,
    errors,
    label,
    helperText,
    className,
    enablePlaceholder = false,
    placeholder,
    name,
    options,
    defaultValue,
    startIcon,
    endIcon,
    ...rest
  } = props;

  const modifiedOptions = options
    ? (Array.isArray(options) ? options : Object.keys(options)).map(option => ({
        value: option.value || option,
        label: option.label || options[option] || option
      }))
    : [];

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
        <CSelect
          id={name}
          name={name}
          invalid={Boolean(error || errors?.[name])}
          innerRef={ref}
          defaultValue={defaultValue || ""}
          {...rest}
        >
          <option value={""} disabled={!enablePlaceholder}>
            {placeholder ||
              (!enablePlaceholder
                ? `-- Select ${label || capitalCase(name)} --`
                : `All ${label || capitalCase(name)}`)}
          </option>
          {modifiedOptions?.map((option, idx) => (
            <option key={idx} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </CSelect>
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

export default MENativeSelect;
