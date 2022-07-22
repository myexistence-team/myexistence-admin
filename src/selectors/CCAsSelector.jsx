import React, { useEffect, useState } from "react";
import MESpinner from "src/components/MESpinner";
import useFromApi from "src/hooks/useFromApi";
import useResourceMapper from "src/hooks/useResourceMapper";
import { camelCase, capitalCase } from "change-case";
import fromApi from "src/actions/fromApi";
import MEControlledSelect from "src/components/MEControlledSelect";
import { useSelector } from "react-redux";

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
function CCAsSelector(props) {
  const {
    label,
    placeholder,
    pageSize = 5,
    pagination = true,
    defaultValue,
    valueKey = "id",
    searchKey = "name",
    resourceLabel = "name",
    pluralAction,
    singularAction,
    pluralName = "ccas",
    singularName = "cca",
    condition = () => true,
    isMulti,
    query: queryProp = {}
  } = props;

  const [search, setSearch] = useState("");
  const [currMultiIdx, setCurrMultiIdx] = useState(0);
  const currId = Array.isArray(defaultValue)
    ? defaultValue[currMultiIdx]
    : defaultValue;
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

  const programmes = useSelector(state => state.programmes);

  const resourceApi = useFromApi(
    pagination
      ? (singularAction || fromApi[`${camelCase(`get ${singularName}`)}`])(
          currId
        )
      : null,
    [currId],
    () => pagination && currId
  );
  const resource = useResourceMapper(pluralName, resourceApi.sortOrder)[0];

  useEffect(() => {
    var newOptions = [];
    if (resources.length) {
      newOptions = [
        ...options.filter(
          o => !resources.map(r => r[valueKey]?.toString()).includes(o.value)
        ),
        ...resources.map(resource => ({
          value: resource[valueKey]?.toString(),
          label: `${resource[resourceLabel]} - ${
            programmes?.[resource.programmeId]?.code
          }`
        }))
      ];
    }
    if (resource) {
      setOptions([
        ...newOptions.filter(o => o.value !== resource[valueKey].toString()),
        {
          value: resource[valueKey]?.toString(),
          label: `${resource[resourceLabel]} - ${
            programmes?.[resource.programmeId]?.code
          }`
        }
      ]);
      if (Array.isArray(defaultValue) && currMultiIdx < defaultValue.length) {
        setCurrMultiIdx(currMultiIdx + 1);
      }
    } else {
      setOptions(newOptions);
    }
  }, [resource, resources]);

  function handleSelectInputChange(search) {
    setSearch(search);
  }

  return (
    <>
      {defaultValue && resourceApi.loading ? (
        <MESpinner size="small" className="w-100 text-center py-0" />
      ) : (
        <MEControlledSelect
          isMulti={isMulti}
          isLoading={resourcesApi.loading}
          options={options}
          defaultValue={defaultValue}
          onInputChange={Boolean(pagination) && handleSelectInputChange}
          label={
            label ||
            capitalCase((isMulti ? pluralName : singularName) || pluralName)
          }
          placeholder={
            placeholder ||
            `Search ${capitalCase(
              (isMulti ? pluralName : singularName) || pluralName
            )}${searchKey ? ` by ${capitalCase(searchKey)}` : ""}`
          }
          {...props}
        />
      )}
    </>
  );
}

export default CCAsSelector;
