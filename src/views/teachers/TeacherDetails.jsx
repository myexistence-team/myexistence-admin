import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CRow } from '@coreui/react';
import moment from 'moment';
import React from 'react'
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { Link, useParams } from 'react-router-dom'
import MESpinner from 'src/components/MESpinner';
import { useFirestoreConnectInSchool, useGetData } from 'src/hooks/getters';

export default function TeacherDetails() {
  const { teacherId } = useParams();

  const teacher = useFirestoreConnectInSchool("teachers", teacherId);
  console.log(teacher);

  const firestore = useFirestore();
  useFirestoreConnect(teacher && {
    collection: "users",
    where: [[firestore.FieldPath.documentId(), "in", [teacher.createdBy, teacher.updatedBy]]],
  })

  const updatedByUser = useGetData("users", teacher?.updatedBy);
  const createdByUser = useGetData("users", teacher?.createdBy);
  // console.log(teacher);

  return (
    <CCard>
      {
        !teacher ? (
          <MESpinner/>
        ) : (
          <>
            <CCardHeader className="d-flex justify-content-between">
              <h3>Detail Pengajar</h3>
              <Link to={`/teachers/${teacherId}/edit`}>
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
                  <h5>{teacher?.fullName}</h5>
                </CCol>
                <CCol xs={12} md={6}>
                  <label>Nomor ID</label>
                  <h5>{teacher?.idNumber}</h5>
                </CCol>
              </CRow>
            </CCardBody>
            <CCardFooter>
              <small>Dibuat oleh {createdByUser?.fullName} pada {moment(teacher.createdAt.toDate()).format("LLL")}</small>
              <br/>
              {
                teacher.updatedAt && (
                  <small>Diedit oleh {updatedByUser?.fullName} pada {moment(teacher.updatedAt.toDate()).format("LLL")}</small>
                )
              }
            </CCardFooter>
          </>
        )
      }
    </CCard>
  )
}
