import { CDataTable } from '@coreui/react';
import React from 'react'
import { useSelector } from 'react-redux';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase'

export default function Schools() {
  useFirestoreConnect(["schools"]);

  const firestore = useSelector((state) => state.firestore);
  const schools = firestore.ordered.schools;
  return (
    <div>
      <CDataTable
        items={schools}
        loading={!isLoaded(schools)}
      />
    </div>
  )
}
