import React from "react";
import { useSelector } from "react-redux";
import { isLoaded, useFirestore, useFirestoreConnect } from "react-redux-firebase";

export function useGetData(listName, id) {
  const list = useSelector(({ 
    firestore: { 
      data 
    } 
  }) => data[listName] && id ? data[listName][id] : data[listName] );
  return list;
}

export function useGetOrdered(listName, ids) {
  var isLoading = true;
  const list = useSelector(({ 
    firestore: { 
      ordered,
      data,
      status: { requesting }
    } 
  }) => {
    isLoading = requesting[listName];
    return ordered[listName] && ids ? 
      ids.map((id) => ({ ...data[listName][id], id })) : 
        ordered[listName] 
  });
  return [list, isLoading];
}

export function useGetProfile() {
  const profile = useSelector(({ firebase }) => firebase.profile);
  return profile;
}

export function useGetAuth() {
  const profile = useSelector(({ firebase }) => firebase.auth);
  return profile;
}

export function useGetSchoolId() {
  const profile = useSelector(({ firebase }) => firebase.profile);
  return profile?.schoolId;
}

export function useFirestoreConnectInSchool(name, id) {
  const firestore = useFirestore();
  const schoolId = useGetSchoolId();
  useFirestoreConnect(id && {
    collection: "schools",
    doc: schoolId,
    subcollections: [
      {
        collection: name,
        where: [[firestore.FieldPath.documentId(), "==", id]]
      }
    ],
    storeAs: name,
  })
  const data = useGetData(name, id);
  return data;
}