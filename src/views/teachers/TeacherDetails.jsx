import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CRow } from '@coreui/react';
import moment from 'moment';
import React from 'react'
import { Helmet } from 'react-helmet';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { Link, useParams } from 'react-router-dom'
import MESpinner from 'src/components/MESpinner';
import { useFirestoreConnectInSchool, useGetData, useGetProfile, useGetSchoolId } from 'src/hooks/getters';

export default function TeacherDetails() {
  const { teacherId } = useParams();

  useFirestoreConnect({
    collection: "users",
    doc: teacherId,
  })

  const firestore = useFirestore();
  const teacher = useGetData("users", teacherId);
  useFirestoreConnect(teacher && {
    collection: "users",
    where: [[firestore.FieldPath.documentId(), "in", [teacher.createdBy, teacher.updatedBy]]],
    storeAs: "admins"
  })

  const updatedByUser = useGetData("admins", teacher?.updatedBy);
  const createdByUser = useGetData("admins", teacher?.createdBy);

  const profile = useGetProfile();

  return (
    <CCard>
      <Helmet>
        <title>{teacher?.displayName || "Loading..."} - Detail Pengajar</title>
      </Helmet>
      {
        !teacher ? (
          <MESpinner/>
        ) : (
          <>
            <CCardHeader className="d-flex justify-content-between">
              <h3>Detail Pengajar</h3>
              {
                profile.role !== "TEACHER" && (
                  <Link to={`/teachers/${teacherId}/edit`}>
                    <CButton
                      color="primary"
                      variant="outline"
                    >
                      Edit
                    </CButton>
                  </Link>
                )
              }
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12} md={6}>
                  <label>Nama Lengkap</label>
                  <h5>{teacher?.displayName}</h5>
                </CCol>
                <CCol xs={12} md={6}>
                  <label>Nomor ID</label>
                  <h5>{teacher?.idNumber}</h5>
                </CCol>
              </CRow>
            </CCardBody>
            <CCardFooter>
              <small>Dibuat oleh {createdByUser?.displayName} pada {moment(teacher.createdAt.toDate()).format("LLL")}</small>
              <br/>
              {
                teacher.updatedAt.seconds !== teacher.createdAt.seconds && (
                  <small>Diedit oleh {updatedByUser?.displayName} pada {moment(teacher.updatedAt.toDate()).format("LLL")}</small>
                )
              }
            </CCardFooter>
          </>
        )
      }
    </CCard>
  )
}
