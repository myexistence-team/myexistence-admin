import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CRow } from '@coreui/react';
import moment from 'moment';
import React from 'react'
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { Link, useParams } from 'react-router-dom'
import MESpinner from 'src/components/MESpinner';
import { useGetData } from 'src/hooks/getters';

export default function StudentDetails() {
  const { studentId } = useParams();

  useFirestoreConnect({
    collection: "users",
    doc: studentId,
  })

  const firestore = useFirestore();
  const student = useGetData("users", studentId);
  useFirestoreConnect(student && {
    collection: "users",
    where: [[firestore.FieldPath.documentId(), "in", [student.createdBy, student.updatedBy]]],
    storeAs: "admins"
  })

  const updatedByUser = useGetData("admins", student?.updatedBy);
  const createdByUser = useGetData("admins", student?.createdBy);

  return (
    <CCard>
    {
      !student ? (
        <MESpinner/>
      ) : (
        <>
          <CCardHeader className="d-flex justify-content-between">
            <h3>Detail Pelajar</h3>
            <Link to={`/students/${studentId}/edit`}>
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
                <label>Nama Lengkap</label>
                <h5>{student?.displayName}</h5>
              </CCol>
              <CCol xs={12} md={6}>
                <label>Email</label>
                <h5>{student?.email}</h5>
              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <small>Dibuat oleh {createdByUser?.displayName} pada {moment(student.createdAt.toDate()).format("LLL")}</small>
            <br/>
            {
              student.updatedAt.seconds !== student.createdAt.seconds && (
                <small>Diedit oleh {updatedByUser?.displayName} pada {moment(student.updatedAt.toDate()).format("LLL")}</small>
              )
            }
          </CCardFooter>
        </>
      )
    }
  </CCard>
  )
}
