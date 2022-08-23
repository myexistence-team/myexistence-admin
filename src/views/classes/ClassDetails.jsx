import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CDataTable, CNav, CNavItem, CNavLink, CRow, CTabContent, CTabPane, CTabs } from '@coreui/react';
import moment from 'moment';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { isLoaded, useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { Link, useParams } from 'react-router-dom'
import MESpinner from 'src/components/MESpinner';
import { useGetData, useGetOrdered, useGetSchoolId } from 'src/hooks/getters';
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { SCHEDULE_START_DATE_MS } from 'src/constants';
import { createSchedule, updateSchedule } from 'src/store/actions/scheduleActions';
import { useDispatch } from 'react-redux';
import { MdArrowLeft, MdArrowRight } from 'react-icons/md';
import { updateClassStudents } from 'src/store/actions/classActions';
import meToaster from 'src/components/toaster';
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export function ClassStudentAssign(props) {
  const {
    classId
  } = props;

  const dispatch = useDispatch();

  const schoolId = useGetSchoolId();
  const classObj = useGetData(`class/${classId}`);
  
  const enrolledStudents = useGetOrdered("students", classObj?.studentIds);
  const students = useGetOrdered("students")?.filter((s) => !classObj?.studentIds?.includes(s.id));

  const [updatingStudents, setUpdatingStudents] = useState(false);

  useFirestoreConnect([
    {
      collection: "users",
      where: [
        ["schoolId", "==", schoolId],
        ["role", "==", "STUDENT"]
      ],
      storeAs: "students"
    },
  ])

  function handleUpdateClassStudents(studentIds) {
    setUpdatingStudents(true);
    dispatch(updateClassStudents(classId, studentIds))
      .catch((e) => {
        meToaster.danger(e.message);
      })
      .finally(() => {
        setUpdatingStudents(false);
      })
  }

  function handleEnrollStudent(studentId) {
    const updatedStudentIds = [ ...classObj?.studentIds, studentId ];
    handleUpdateClassStudents(updatedStudentIds);
  }

  function handleUnenrollStudent(studentId) {
    const updatedStudentIds = [ ...classObj?.studentIds ].filter((sId) => sId !== studentId);
    handleUpdateClassStudents(updatedStudentIds);
  }

  return (
    <CRow className="mt-3">
      <CCol xs={12} md={6}>
        <h4>Pelajar</h4>
        <CDataTable
          items={students}
          loading={updatingStudents || !isLoaded(students)}
          fields={[
            { key: "displayName", label: "Nama" },
            { key: "enroll", label: "" }
          ]}
          tableFilter
          scopedSlots={{
            enroll: (s) => (
              <td className="d-flex justify-content-end">
                <CButton
                  color="primary"
                  onClick={() => handleEnrollStudent(s.id)}
                >
                  <MdArrowRight/>
                </CButton>
              </td>
            )
          }}
        />
      </CCol>
      <CCol xs={12} md={6}>
        <h4>Pelajar Terdaftar di Kelas</h4>
        <CDataTable
          items={enrolledStudents}
          loading={updatingStudents || !isLoaded(students)}
          fields={[
            { key: "unenroll", label: "" },
            { key: "displayName", label: "Nama" },
          ]}
          tableFilter
          scopedSlots={{
            unenroll: (s) => (
              <td>
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={() => handleUnenrollStudent(s.id)}
                >
                  <MdArrowLeft/>
                </CButton>
              </td>
            )
          }}
        />
      </CCol>
    </CRow>
  )
}

export default function ClassDetails() {
  const firestore = useFirestore();
  const { classId } = useParams();
  const dispatch = useDispatch();
  const schoolId = useGetSchoolId();

  useFirestoreConnect([
    {
      collection: "schools",
      doc: schoolId,
      subcollections: [
        {
          collection: "classes",
          doc: classId,
        },
      ],
      storeAs: `class/${classId}`
    }, {
      collection: "schools",
      doc: schoolId,
      subcollections: [
        {
          collection: "classes",
          doc: classId,
          subcollections: [{
            collection: "schedules"
          }]
        }
      ],
      storeAs: "schedules"
    }
  ])
  const classObj = useSelector((state) => state.firestore.data[`class/${classId}`]);
  const schedules = useGetOrdered("schedules");
  const schedulesForCalendar = schedules?.map((s) => ({
    ...s,
    title: "",
    start: s.start.toDate(),
    end: s.end.toDate(),
  }))

  useFirestoreConnect(classObj && {
    collection: "users",
    where: [[firestore.FieldPath.documentId(), "in", [classObj.createdBy, classObj.updatedBy]]],
    storeAs: "users"
  })

  const updatedByUser = useGetData("users", classObj?.updatedBy);
  const createdByUser = useGetData("users", classObj?.createdBy);

  function handleEventDrop(slot) {
    const { start, end, event } = slot;
    const payload = {
      start,
      end,
      day: start.getDay()
    }
    dispatch(updateSchedule(classId, event.id, payload));
  }

  function handleEventClick(event) {
    console.log(event);
  }

  function handleSelectSlot(slot) {
    const { start, end } = slot;
    const payload = {
      start,
      end,
      day: start.getDay()
    }
    dispatch(createSchedule(classId, payload));
  }

  return (
    <CCard>
      {
        classObj && isLoaded(classObj) ?  (
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
              <CRow className="mb-3">
                <CCol xs={12} md={6}>
                  <label>Nama</label>
                  <h5>{classObj?.name}</h5>
                </CCol>
                <CCol xs={12} md={6}>
                  <label>Deskripsi</label>
                  <h5>{classObj?.description}</h5>
                </CCol>
              </CRow>
              <CTabs activeTab="schedule">
                <CNav variant="tabs">
                  <CNavItem>
                    <CNavLink data-tab="schedule">
                      Jadwal
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink data-tab="students">
                      Pelajar
                    </CNavLink>
                  </CNavItem>
                </CNav>
                <CTabContent>
                  <CTabPane data-tab="schedule">
                    <h4 className="mt-3 mb-0">Jadwal</h4>
                    <div className="mb-3">
                      <small>Jadwal yang dibuat akan diulang per minggu</small>
                    </div>
                    {
                      isLoaded(schedules) && (
                        <DnDCalendar
                          defaultDate={moment(SCHEDULE_START_DATE_MS).toDate()}
                          toolbar={false}
                          views={[
                            "week"
                          ]}
                          defaultView="week"
                          localizer={localizer}
                          resizable
                          style={{ height: "500px" }}
                          events={schedulesForCalendar}
                          onEventDrop={handleEventDrop}
                          onSelectEvent={handleEventClick}
                          onSelectSlot={handleSelectSlot}
                          selectable
                          components={{
                            week: {
                              header: ({ date, localizer }) => localizer.format(date, 'dddd')
                            }
                          }}
                        />
                      )
                    }
                  </CTabPane>
                  <CTabPane data-tab="students">
                    <ClassStudentAssign classId={classId}/>
                  </CTabPane>
                </CTabContent>
              </CTabs>
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
        ) : (
          <MESpinner/>
        ) 
      }
    </CCard>
  )
}
