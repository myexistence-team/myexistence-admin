import { CButton, CCard, CCardBody, CCardHeader } from '@coreui/react';
import React from 'react'
import { useSelector } from 'react-redux'
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import MESpinner from 'src/components/MESpinner';
import { SCHOOL_TYPES } from 'src/enums';

export default function MySchool() {
  const profile = useSelector((state) => state.firebase.profile);
  console.log(profile)

  useFirestoreConnect([ `/schools/${profile.schoolId}` ]);
  const school = useSelector((state) => state.firestore.data.schools)?.[profile.schoolId];
  console.log(school)

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between">
        <h3>Sekolahku</h3>
        <div>
          <CButton
            is={Link}
            to="/my-school/edit"
            color="primary"
            variant="outline"
          >
            Edit
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        {
          school ? (
            <>
              <div className="mb-3">
                <label>Nama Sekolah</label>
                <h5>{school.name}</h5>
              </div>
              <div>
                <label>Tipe Sekolah</label>
                <h5>{SCHOOL_TYPES[school.type]}</h5>
              </div>
            </>
          ) : (
            <MESpinner/>
          )
        }
      </CCardBody>
    </CCard>
  )
}
