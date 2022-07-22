import React from "react";
import { capitalCase } from "change-case";
import { useSelector } from "react-redux";
import meColors from "src/components/meColors";
import CreatableSelect from "react-select/creatable";

function MECreatableSelect(props) {
  const darkMode = useSelector(state => state.coreUi.darkMode);
  const {
    invalid,
    options,
    inputRef,
    isMulti = false,
    onChange,
    value,
    placeholder,
    label,
    name,
    isClearable = true,
    ...rest
  } = props;

  const modifiedOptions = options
    ? (Array.isArray(options) ? options : Object.keys(options)).map(option => ({
        value: option.value || option,
        label: option.label || options[option] || option
      }))
    : [];

  return (
    <CreatableSelect
      {...rest}
      isClearable={isClearable}
      options={modifiedOptions}
      isMulti={isMulti}
      inputRef={inputRef}
      onChange={v =>
        onChange(
          v ? (isMulti ? (v.length ? v.map(v => v.value) : []) : v.value) : null
        )
      }
      value={
        !isMulti
          ? modifiedOptions.find(c => c.value === value)
          : modifiedOptions.filter(c => value?.includes(c.value))
      }
      placeholder={placeholder || `Search ${label || capitalCase(name)}`}
      styles={{
        control: provided => ({
          ...provided,
          height: props.styles?.control?.height || 35
        }),
        container: provided => ({
          ...provided,
          width: props.styles?.container?.width || "100%"
        })
      }}
      theme={theme => {
        return (
          {
            ...theme,
            colors: {
              ...theme.colors,
              danger: meColors.danger,
              primary: darkMode ? "black" : meColors.primary.main,
              primary25: darkMode ? "black" : meColors.primary.light,
              dangerLight: darkMode ? "black" : theme.colors.dangerLight,
              neutral0: darkMode ? "#2a2b36" : theme.colors.neutral0,
              neutral20: darkMode
                ? "rgba(255, 255, 255, 0.09)"
                : meColors.white1
            },
            spacing: {
              ...theme.spacing,
              controlHeight: 35
            }
          } || props.theme
        );
      }}
    />
  );
}

MECreatableSelect.propTypes = {
  ...CreatableSelect.propTypes
};

export default MECreatableSelect;
