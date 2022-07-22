import React, { useEffect, useState } from "react";
import fromApi from "src/actions/fromApi";
import useFromApi from "src/hooks/useFromApi";
import useResourceMapper from "src/hooks/useResourceMapper";
import KKSelect from "./MESelect";

export default function METagSelect(props) {
  const tagIdsInString = props.tagIdsInString;
  const selectedTags = props.tags || props.value;
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);

  const tagsApi = useFromApi(fromApi.getTagsByName(search, 0, 5), [search]);
  const tags = useResourceMapper("tags", tagsApi.sortOrder);

  const tagsByIdsApi = useFromApi(fromApi.getTagsByIds(tagIdsInString), [
    tagIdsInString
  ]);
  const selectedTagsByIds = useResourceMapper("tags", tagsByIdsApi.sortOrder);

  const selectedTagsByIdsOptions = selectedTagsByIds.map(tag => ({
    value: parseInt(tag.id),
    label: tag.name
  }));

  const tagsOptions = tags.map(tag => ({
    value: parseInt(tag.id),
    label: tag.name
  }));

  const tagIds = selectedTags?.map(tag => tag.value);

  useEffect(() => {
    setOptions(
      tagsOptions.filter(tagsOption => !tagIds?.includes(tagsOption.value))
    );
  }, [tags]);

  function handleSelectInputChange(search) {
    setSearch(search);
  }

  return (
    <KKSelect
      data-testid="typeFilter"
      isMulti={props.isMulti !== undefined ? props.isMulti : true}
      isClearable={props.isClearable !== undefined ? props.isClearable : true}
      isLoading={props.isLoading || tagsApi.loading}
      value={
        tagIdsInString !== undefined ? selectedTagsByIdsOptions : selectedTags
      }
      options={options}
      placeholder={props.placeholder || "Select tags"}
      onInputChange={handleSelectInputChange}
      {...props}
    />
  );
}
