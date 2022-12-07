import React, { useEffect, useState } from "react";
import MESpinner from "src/components/MESpinner";
import useFromApi from "src/hooks/useFromApi";
import useResourceMapper from "src/hooks/useResourceMapper";
import MEControlledSelect from "./MEControlledSelect";
import { camelCase, capitalCase } from "change-case";
import fromApi from "src/actions/fromApi";
import { useSelector } from "react-redux";
import MESelect from "./MESelect";

/**
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.placeholder
 * @param {number} props.pageSize
 * @param {boolean} props.pagination
 * @param {boolean} props.isMulti
 * @param {string} props.defaultValue
 * @param {string} props.resourceLabel
 * @param {Object} props.pluralAction
 * @param {Object} props.singularAction
 * @param {string} props.pluralName
 * @param {string} props.singularName
 */
function MEResourceSelect(props) {
  const {
    label,
    placeholder,
    pageSize = 5,
    pagination = true,
    defaultValue,
    value,
    valueKey = "id",
    searchKey = "name",
    resourceLabel,
    pluralAction,
    singularAction,
    pluralName,
    singularName,
    singularQuery,
    condition = () => true,
    isMulti,
    replace = false,
    query: queryProp = {}
  } = props;

  const [search, setSearch] = useState("");
  const [currMultiIdx, setCurrMultiIdx] = useState(0);
  const currId = Array.isArray(defaultValue || value)
    ? (defaultValue || value)[currMultiIdx]
    : defaultValue || value;

  const [options, setOptions] = useState([]);

  var query = {
    ...(pagination ? { page: 0, pageSize, ...queryProp } : queryProp)
  };
  query[searchKey] = search;

  const resourcesApi = useFromApi(
    (pluralAction || fromApi[`${camelCase(`get ${pluralName}`)}`])(query),
    [...(pagination ? Object.values(query) : [])],
    condition
  );
  const resources = useResourceMapper(pluralName, resourcesApi.sortOrder);

  const resourceApi = useFromApi(
    pagination
      ? (singularAction || fromApi[`${camelCase(`get ${singularName}`)}`])(
          singularQuery || currId
        )
      : null,
    [...(singularQuery ? Object.values(singularQuery) : [currId])],
    () => pagination && currId
  );
  const resource = useResourceMapper(pluralName, resourceApi.sortOrder)[0];

  useEffect(() => {
    var newOptions = [];
    if (resources.length) {
      newOptions = [
        ...(replace
          ? []
          : options.filter(
              o =>
                !resources.map(r => r[valueKey]?.toString()).includes(o.value)
            )),
        ...resources.map(resource => ({
          value: resource[valueKey]?.toString(),
          label: resource[resourceLabel || searchKey]
        }))
      ];
    }
    if (resource) {
      setOptions([
        ...newOptions.filter(o => o.value !== resource[valueKey].toString()),
        {
          value: resource[valueKey]?.toString(),
          label: resource[resourceLabel || searchKey]
        }
      ]);
      if (
        Array.isArray(defaultValue || value) &&
        currMultiIdx < (defaultValue || value).length
      ) {
        setCurrMultiIdx(currMultiIdx + 1);
      }
    } else {
      setOptions(newOptions);
    }
  }, [resource, resources]);

  function handleSelectInputChange(search) {
    setSearch(search);
  }

  const selectProps = {
    isMulti,
    isLoading: resourcesApi.loading,
    options,
    defaultValue,
    onInputChange: Boolean(pagination) && handleSelectInputChange,
    label:
      label || capitalCase((isMulti ? pluralName : singularName) || pluralName),
    placeholder:
      placeholder ||
      `Cari ${capitalCase(
        (isMulti ? pluralName : singularName) || pluralName
      )}${searchKey ? ` by ${capitalCase(searchKey)}` : ""}`,
    ...props
  };

  return (
    <>
      {defaultValue && resourceApi.loading ? (
        <MESpinner size="small" className="w-100 text-center py-0" />
      ) : props.control ? (
        <MEControlledSelect {...selectProps} />
      ) : (
        <MESelect {...selectProps} />
      )}
    </>
  );
}

export default MEResourceSelect;
