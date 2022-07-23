import React from "react";
import { useSelector } from "react-redux";

export function useGetData(listName, id) {
  const list = useSelector(({ 
    firestore: { 
      data 
    } 
  }) => data[listName] && id ? data[listName][id] : data[listName] );
  return list;
}