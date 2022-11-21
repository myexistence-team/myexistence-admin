import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CNav, CNavItem, CNavLink, CRow, CTabContent, CTabPane, CTabs } from '@coreui/react';
import moment from 'moment';
import React from 'react'
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { Link, useParams } from 'react-router-dom'
import meConfirm from 'src/components/meConfirm';
import MESpinner from 'src/components/MESpinner';
import ScheduleCalendar from 'src/components/ScheduleCalendar';
import { useGetAuth, useGetData, useGetOrdered, useGetProfile, useGetSchoolId } from 'src/hooks/getters';
import { deleteTeacher } from 'src/store/actions/teacherActions';

export default function TeacherDetails() {
  const { teacherId } = useParams();

  const firestore = useFirestore();
  const [teacher, teacherLoading] = useGetData("users", teacherId);
  const schoolId = useGetSchoolId();
  useFirestoreConnect([
    {
      collection: "users",
      doc: teacherId,
    },
    ...teacher ? [{
      collection: "users",
      where: [[firestore.FieldPath.documentId(), "in", [teacher.createdBy, teacher.updatedBy]]],
      storeAs: "admins"
    }] : [],
    ...teacher?.classIds?.length ? [
      {
        collection: "schools",
        doc: schoolId,
        subcollections: [{
          collection: "classes",
          where: [[firestore.FieldPath.documentId(), "in", teacher.classIds]]
        }],
        storeAs: "classes"
      }, {
        collectionGroup: "schedules",
        where: [["classId", "in", teacher.classIds]]
      }
    ] : []
  ])

  const [classes, classesLoading] = useGetOrdered("classes", teacher?.classIds);

  const [updatedByUser] = useGetData("admins", teacher?.updatedBy);
  const [createdByUser] = useGetData("admins", teacher?.createdBy);

  const profile = useGetProfile();
  const auth = useGetAuth();

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
        dispatch(deleteTeacher(studentId));
      }
    })
  }

  return (
    <CCard>
      <Helmet>
        <title>{teacher?.displayName || "Loading..."} - Detail Pengajar</title>
      </Helmet>
      {
        teacherLoading || !teacher ? (
          <MESpinner/>
        ) : (
          <>
            <CCardHeader className="d-flex justify-content-between">
              <h3>Detail Pengajar</h3>
              <div className="d-flex">
                {
                  profile.role !== "TEACHER" && (
                    <div className="mr-3">
                      <CButton
                        color="danger"
                        variant="outline"
                        className="ml-3"
                        onClick={() => handleDelete(teacherId)}
                      >
                        Hapus
                      </CButton>
                    </div>
                  )
                }
                {
                  (profile.role !== "TEACHER" || teacherId === auth.uid) && (
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
              </div>
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
                      {
                        teacher.photoUrl && (
                          <CCol xs={12} md={3}>
                            <img
                              src={teacher.photoUrl}
                              alt={teacher.displayName}
                              width="100%"
                            />
                          </CCol>
                        )
                      }
                      <CCol xs={12} md={teacher.photoUrl ? 9 : 12}>                        
                        <CRow>                        
                          <CCol xs={12} md={6}>
                            <label>Nama Lengkap</label>
                            <h5>{teacher?.displayName}</h5>
                          </CCol>
                          <CCol xs={12} md={6}>
                            <label>Nomor ID</label>
                            <h5>{teacher?.idNumber}</h5>
                          </CCol>
                          <CCol xs={12}>
                            <label>Deskripsi</label>
                            <h5>{teacher?.description}</h5>
                          </CCol>
                        </CRow>
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
