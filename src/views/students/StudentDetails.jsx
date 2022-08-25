import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CDataTable, CNav, CNavItem, CNavLink, CRow, CTabContent, CTabPane, CTabs } from '@coreui/react';
import moment from 'moment';
import React from 'react'
import { Helmet } from 'react-helmet';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { Link, useParams } from 'react-router-dom'
import MESpinner from 'src/components/MESpinner';
import ScheduleCalendar from 'src/components/ScheduleCalendar';
import { useGetData, useGetOrdered, useGetProfile, useGetSchoolId } from 'src/hooks/getters';

export default function StudentDetails() {
  const { studentId } = useParams();

  useFirestoreConnect({
    collection: "users",
    doc: studentId,
  })

  const firestore = useFirestore();
  const [student] = useGetData("users", studentId);
  const schoolId = useGetSchoolId();
  useFirestoreConnect(student && [
    {
      collection: "users",
      where: [[firestore.FieldPath.documentId(), "in", [student.createdBy, student.updatedBy]]],
      storeAs: "students"
    }, ...student.classIds?.length ? [
      {
        collection: "schools",
        doc: schoolId,
        subcollections: [{
          collection: "classes",
          where: [[firestore.FieldPath.documentId(), "in", student.classIds]]
        }],
        storeAs: "classes"
      }, {
        collectionGroup: "schedules",
        where: [["classId", "in", student.classIds || ["e"]]]
      }
    ] : []
  ])

  const [updatedByUser] = useGetData("students", student?.updatedBy);
  const [createdByUser] = useGetData("students", student?.createdBy);
  const [classes, classesLoading] = useGetOrdered("classes", student?.classIds);

  const profile = useGetProfile();

  const [schedules, schedulesLoading] = useGetData("schedules");
  const schedulesOrdered = schedules ? Object.keys(schedules).map((sId) => ({ 
    ...schedules[sId],
    id: sId, 
    start: schedules[sId].start.toDate(),
    end: schedules[sId].end.toDate(),
    title: classes?.find(({ id }) => id === schedules[sId].classId)?.name,
  })) : [];

  return (
    <CCard>
    <Helmet>
      <title>{student?.displayName || "Loading..."} - Detail Pelajar</title>
    </Helmet>
    {
      !student ? (
        <MESpinner/>
      ) : (
        <>
          <CCardHeader className="d-flex justify-content-between">
            <h3>Detail Pelajar</h3>
            {
              profile.role !== "TEACHER" && (
                <Link to={`/students/${studentId}/edit`}>
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
          <CTabs activeTab="details">
            <CNav variant="tabs">
              <CNavItem>
                <CNavLink data-tab="details">
                  Detail
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink data-tab="schedule">
                  Jadwal
                </CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent>
              <CTabPane data-tab="details">
                <CRow className="mt-3">
                  <CCol xs={12} md={6}>
                    <label>Nama Lengkap</label>
                    <h5>{student?.displayName}</h5>
                  </CCol>
                  <CCol xs={12} md={6}>
                    <label>Email</label>
                    <h5>{student?.email}</h5>
                  </CCol>
                  <CCol xs={12}>
                    <label className="mt-3">Kelas</label>
                    <CDataTable
                      items={classes}
                      fields={[
                        { key: "name", label: "Nama" },
                        { key: "description", label: "Deskripsi" },
                      ]}
                      scopedSlots={{
                        name: (c) => (
                          <td>
                            <Link to={`/classes/${c.id}`}>
                              {c.name}
                            </Link>
                          </td>
                        ),
                      }}
                      loading={classesLoading}
                    />
                  </CCol>
                </CRow>
              </CTabPane>
              <CTabPane data-tab="schedule">
                <ScheduleCalendar
                  events={schedulesOrdered}
                  loading={schedulesLoading}
                  className="mt-3"
                />
              </CTabPane>
            </CTabContent>
          </CTabs>
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
