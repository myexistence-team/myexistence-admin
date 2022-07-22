import { CFormGroup, CFormText, CLabel } from "@coreui/react";
import React from "react";
import { Controller } from "react-hook-form";
import MESelect from "src/components/MESelect";
import { capitalCase } from "change-case";

function MEControlledSelect(props) {
  const {
    id,
    control,
    className,
    label,
    helperText,
    defaultValue,
    isMulti = false,
    name,
    options,
    key,
    ...rest
  } = props;

  return (
    <Controller
      id={id}
      key={key}
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={controlProps => {
        const { field, fieldState } = controlProps;
        const { error, invalid } = fieldState;
        const { onChange, value, name, ref } = field;
        return (
          <CFormGroup className={className || "text-nowrap"}>
            {!(typeof label === "boolean" && !label) && (
              <CLabel htmlFor={name}>{label || capitalCase(name)}</CLabel>
            )}
            <MESelect
              isMulti={isMulti}
              invalid={invalid}
              id={name}
              name={name}
              options={options}
              inputRef={ref}
              onChange={onChange}
              value={value}
              {...rest}
            />
            <CFormText className="help-block text-wrap">{helperText}</CFormText>
            <CFormText color="danger" className="help-block text-wrap">
              {error?.message}
            </CFormText>
          </CFormGroup>
        );
      }}
    />
  );
}

export default MEControlledSelect;
