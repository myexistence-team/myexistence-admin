import React from 'react'
import { useSelector } from 'react-redux';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase'
import { useGetSchoolId } from 'src/hooks/getters';
import MESpinner from './MESpinner';
import MEControlledSelect from './MEControlledSelect';
import { useState } from 'react';
import { capitalCase } from 'change-case';

export default function MEFirestoreSelect({
  listName,
  storeAs,
  singularName,
  control,
  label,
  placeholder,
  where,
  defaultValue,
  valueKey = "id",
  labelKey = "name",
  isMulti,
  ...rest
}) {

  const schoolId = useGetSchoolId();
  useFirestoreConnect(
    listName === "users" || listName === "schools" ? {
      collection: listName,
      orderBy: "createdAt",
      storeAs: storeAs || listName,
      where
    } : {
      collection: "schools",
      doc: schoolId,
      subcollections: [
        {
          collection: listName
        }
      ],
      storeAs: storeAs || listName,
      orderBy: "createdAt",
      where
    },
  );

  const list = useSelector(
    ({ firestore: { ordered } }) => ordered[storeAs || listName]
  );
  const options = list?.map((a) => ({ value: a[valueKey], label: a[labelKey] }));

  return (
    <>
      {
        defaultValue && !isLoaded(list) && !list?.length ? (
          <MESpinner size="small" className="w-100 text-center py-0" />
        ) : (
          <MEControlledSelect
            isLoading={!isLoaded(list)}
            isMulti={isMulti}
            control={control}
            options={options}
            defaultValue={defaultValue}
            label={
              typeof label !== "boolean" ? label ||
              capitalCase((isMulti ? listName : singularName) || listName) : label
            }
            placeholder={
              placeholder ||
              `Search ${capitalCase(
                (isMulti ? listName : singularName) || listName
              )}${labelKey ? ` by ${capitalCase(labelKey)}` : ""}`
            }
            {...rest}
          />
        )
      }
    </>
  )
}
