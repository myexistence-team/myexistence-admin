import { first, last } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase'
import meToaster from 'src/components/toaster'

export function useFirestorePagination(listName, query, where) {
  const [pointer, setPointer] = useState(undefined) // Current pointer
  const [forwardPointer, setForwardPointer] = useState(undefined) // Forward pointer
  const [backwardPointers, setBackwardPointers] = useState([]) // Backward pointers chain
  const [page, setPage] = useState(0) // current  page
  const [limit, setLimit] = useState(query.pageSize || 10) // limit

  // Get auth from redux state
  const profile = useSelector(({ firebase: { profile } }) => profile);

  useFirestoreConnect(
    listName === "users" || listName === "schools" ? {
      collection: listName,
      orderBy: "createdAt",
      limit: limit + 1,
      startAt: pointer,
      where
    } : {
      collection: "schools",
      doc: profile.schoolId,
      subcollections: [
        {
          collection: listName
        }
      ],
      storeAs: listName,
      orderBy: "createdAt",
      limit: limit + 1,
      startAt: pointer,
      where
    },
  );
  
  // Get list from redux state
  var list = useSelector(
    ({ firestore: { ordered } }) => ordered[listName]
  );
  var listRet = [ ...list || [] ];
  if (listRet.length > query.pageSize) {
    listRet.splice(-1,1);
  }

  // Set forward pointer
  useEffect(() => {
    if (list && Array.isArray(list) && list.length > limit) { 
      setForwardPointer(last(list)?.createdAt);
    }
  }, [list])

  // add pointer to back chain 
  useEffect(() => {
    if (list) {
      const firstItem = first(list)
      if (firstItem) { 
        setBackwardPointers((prevState) => { 
          const newState = prevState
          newState[page] = firstItem.createdAt
          return newState
        })
      }
    }
  }, [page, list])
  
  const handlePageChange = (newPage) => {
    if (list && list.length) {
      if (page < newPage && forwardPointer) {
        // Forward
        setPointer(forwardPointer)
      } else if (page >= newPage) {
        // Backward
        setPointer(backwardPointers[newPage])
      }
    }

    console.log(list?.length, limit + 1)
    if (list && list.length <= limit + 1) {
      setPage(newPage);
    } else { 
      // if (page > 0) {
      //   meToaster.warning("No more records!")
      // }
    }
  };

  return { list: listRet, limit, setLimit, page, handlePageChange};
}
