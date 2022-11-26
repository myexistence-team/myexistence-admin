import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CDataTable, CNav, CNavItem, CNavLink, CRow, CTabContent, CTabPane, CTabs } from '@coreui/react';
import moment from 'moment';
import React from 'react'
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { Link, useParams } from 'react-router-dom'
import meConfirm from 'src/components/meConfirm';
import MESpinner from 'src/components/MESpinner';
import ScheduleCalendar from 'src/components/ScheduleCalendar';
import { useGetData, useGetOrdered, useGetProfile, useGetSchoolId } from 'src/hooks/getters';
import { deleteStudent } from 'src/store/actions/studentActions';
import StudentDetailsAttendances from './StudentDetailsAttendances';

export default function StudentDetails() {
  const { studentId } = useParams();

  useFirestoreConnect({
    collection: "users",
    doc: studentId,
  })

  const firestore = useFirestore();
  const [student, studentLoading] = useGetData("users", studentId);
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

  const dispatch = useDispatch();
  function handleDelete(studentId) {
    meConfirm({
      confirmButtonColor: "danger",
      onConfirm: () => {
        dispatch(deleteStudent(studentId));
      }
    })
  }

  return (
    <CCard>
    <Helmet>
      <title>{student?.displayName || "Loading..."} - Detail Pelajar</title>
    </Helmet>
    {
      studentLoading || !student ? (
        <MESpinner/>
      ) : (
        <>
          <CCardHeader className="d-flex justify-content-between">
            <h3>Detail Pelajar</h3>
            {
              profile.role !== "TEACHER" && (
                <div className="d-flex">
                  <div className="mr-3">
                    <CButton
                      color="danger"
                      variant="outline"
                      className="ml-3"
                      onClick={() => handleDelete(studentId)}
                    >
                      Hapus
                    </CButton>
                  </div>
                  <Link to={`/students/${studentId}/edit`}>
                    <CButton
                      color="primary"
                      variant="outline"
                    >
                      Edit
                    </CButton>
                  </Link>
                </div>
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
              <CNavItem>
                <CNavLink data-tab="attendances">
                  Kehadiran Pelajar
                </CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent>
              <CTabPane data-tab="details">
                <CRow className="mt-3">
                  {
                    student.photoUrl && (
                      <CCol xs={12} md={3}>
                        <img
                          src={student.photoUrl}
                          alt={student.displayName}
                          width="100%"
                        />
                      </CCol>
                    )
                  }
                  <CCol xs={12} md={student.photoUrl ? 9 : 12}>
                    <CRow>
                      <CCol xs={12} md={6}>
                        <label>Nama Lengkap</label>
                        <h5>{student?.displayName}</h5>
                      </CCol>
                      <CCol xs={12} md={6}>
                        <label>Email</label>
                        <h5>{student?.email}</h5>
                      </CCol>
                      <CCol xs={12}>
                        <label>Deskripsi</label>
                        <h5>{student?.description}</h5>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
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
              </CTabPane>
              <CTabPane data-tab="schedule">
                <ScheduleCalendar
                  events={schedulesOrdered}
                  loading={schedulesLoading}
                  className="mt-3"
                />
              </CTabPane>
              <CTabPane data-tab="attendances">
                <StudentDetailsAttendances/>
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
