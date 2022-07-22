import { CFormGroup, CFormText, CInputRadio, CLabel } from "@coreui/react";
import { capitalCase } from "change-case";
import React from "react";

const MERadioSelect = React.forwardRef((props, ref) => {
  const {
    id,
    key,
    className,
    defaultChecked,
    error,
    errors,
    register,
    label,
    helperText,
    options,
    name,
    ...rest
  } = props;

  const modifiedOptions = options
    ? (Array.isArray(options) ? options : Object.keys(options)).map(option => ({
        value: option.value || option,
        label: option.label || options[option] || option
      }))
    : null;

  return (
    <CFormGroup id={id} key={key} className={className}>
      {!(typeof label === "boolean" && !label) && (
        <CLabel htmlFor={name}>{label || capitalCase(name)}</CLabel>
      )}
      <br />
      <div className={`${modifiedOptions.length < 3 && "d-flex"}`}>
        {modifiedOptions.map((option, idx) => (
          <div
            key={idx}
            className={`form-check ${modifiedOptions.length < 3 && "mr-3"}`}
          >
            <CInputRadio
              defaultChecked={option.value === defaultChecked}
              id={option.value}
              name={name}
              value={option.value}
              invalid={Boolean(error || errors?.[name])}
              innerRef={ref}
              {...rest}
            />
            <label htmlFor={option.value} className="form-check-label">
              {capitalCase(option.label)}
            </label>
          </div>
        ))}
      </div>
      <CFormText className="help-block">{helperText}</CFormText>
      <CFormText color="danger" className="help-block">
        {error?.message || errors?.[name]?.message}
      </CFormText>
    </CFormGroup>
  );
});

export default MERadioSelect;
