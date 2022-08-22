import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CRow } from '@coreui/react';
import moment from 'moment';
import React from 'react'
import { useSelector } from 'react-redux';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { Link, useParams } from 'react-router-dom'
import MESpinner from 'src/components/MESpinner';
import { useGetData, useGetSchoolId } from 'src/hooks/getters';

export default function ClassDetails() {
  const firestore = useFirestore();
  const { classId } = useParams();

  const schoolId = useGetSchoolId();
  useFirestoreConnect({
    collection: "schools",
    doc: schoolId,
    subcollections: [
      {
        collection: "classes",
        doc: classId
      }
    ],
    storeAs: "class"
  })
  const classObj = useSelector((state) => state.firestore.data.class)

  useFirestoreConnect(classObj && {
    collection: "users",
    where: [[firestore.FieldPath.documentId(), "in", [classObj.createdBy, classObj.updatedBy]]],
    storeAs: "users"
  })

  const updatedByUser = useGetData("users", classObj?.updatedBy);
  const createdByUser = useGetData("users", classObj?.createdBy);

  return (
    <CCard>
      {
        !classObj ? (
          <MESpinner/>
        ) : (
          <>
            <CCardHeader className="d-flex justify-content-between">
              <h3>Detail Kelas</h3>
              <Link to={`/classes/${classId}/edit`}>
                <CButton
                  color="primary"
                  variant="outline"
                >
                  Edit
                </CButton>
              </Link>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12} md={6}>
                  <label>Nama</label>
                  <h5>{classObj?.name}</h5>
                </CCol>
                <CCol xs={12} md={6}>
                  <label>Deskripsi</label>
                  <h5>{classObj?.description}</h5>
                </CCol>
              </CRow>
            </CCardBody>
            <CCardFooter>
              <small>Dibuat oleh {createdByUser?.displayName} pada {moment(classObj.createdAt.toDate()).format("LLL")}</small>
              <br/>
              {
                classObj.updatedAt.seconds !== classObj.createdAt.seconds && (
                  <small>Diedit oleh {updatedByUser?.displayName} pada {moment(classObj.updatedAt.toDate()).format("LLL")}</small>
                )
              }
            </CCardFooter>
          </>
        )
      }
    </CCard>
  )
}
