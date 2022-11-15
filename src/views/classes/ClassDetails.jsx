import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CDataTable, CNav, CNavItem, CNavLink, CRow, CTabContent, CTabPane, CTabs } from '@coreui/react';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { isLoaded, useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { Link, useParams } from 'react-router-dom'
import MESpinner from 'src/components/MESpinner';
import { useGetAuth, useGetData, useGetOrdered, useGetProfile, useGetSchoolId } from 'src/hooks/getters';
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { SCHEDULE_START_DATE_MS } from 'src/constants';
import { createSchedule, updateSchedule } from 'src/store/actions/scheduleActions';
import { useDispatch } from 'react-redux';
import { MdArrowLeft, MdArrowRight } from 'react-icons/md';
import { ENROLLMENT_ACTIONS, updateClassStudent } from 'src/store/actions/classActions';
import meToaster from 'src/components/toaster';
import { Helmet } from 'react-helmet';
import { ATTENDANCE_STATUS_ENUM } from 'src/enums';
import { getAttendanceStatusColor } from 'src/utils/utilFunctions';
import meColors from 'src/components/meColors';
import { CChart } from '@coreui/react-chartjs';
import MESelect from 'src/components/MESelect';
import ScheduleModal from 'src/components/ScheduleModal';
moment.locale('id', {
  week: {
    dow: 1
  }
})
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export function ClassStudents(props) {
  const {
    classId
  } = props;

  const dispatch = useDispatch();

  const schoolId = useGetSchoolId();
  const [classObj] = useGetData(`class/${classId}`);
  
  const [enrolledStudents, enrolledStudentsLoading] = useGetOrdered("students", classObj?.studentIds);
  const [studentsOrdered, studentsLoading] = useGetOrdered("students")
  const students = studentsOrdered?.filter((s) => !classObj?.studentIds?.includes(s.id));

  const [updatingStudents, setUpdatingStudents] = useState(false);

  useFirestoreConnect([
    {
      collection: "users",
      where: [
        ["schoolId", "==", schoolId],
        ["role", "==", "STUDENT"],
        ["hasRegistered", "==", true],
      ],
      storeAs: "students"
    },
  ])

  function handleUpdateClassStudent(action, studentId) {
    setUpdatingStudents(true);
    dispatch(updateClassStudent(action, classId, studentId))
      .catch((e) => {
        meToaster.danger(e.message);
      })
      .finally(() => {
        setUpdatingStudents(false);
      })
  }

  function handleEnrollStudent(studentId) {
    handleUpdateClassStudent(ENROLLMENT_ACTIONS.ENROLL, studentId);
  }

  function handleUnenrollStudent(studentId) {
    handleUpdateClassStudent(ENROLLMENT_ACTIONS.UNENROLL, studentId);
  }

  const auth = useGetAuth();
  const profile = useGetProfile();
  const isOwnClassOrAdmin = classObj?.teacherIds?.includes(auth.uid) || profile.role !== "TEACHER";

  return (
    <CRow className="mt-3">
      {
        isOwnClassOrAdmin && (
          <CCol xs={12} md={6}>
            <h4>Pelajar</h4>
            <small>Pelajar yang sudah terdaftar di sekolah</small>
            <CDataTable
              items={students}
              loading={updatingStudents || studentsLoading}
              fields={[
                { key: "displayName", label: "Nama" },
                ...isOwnClassOrAdmin ? [{ key: "enroll", label: "" }] : []
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
                ),
                displayName: (s) => (
                  <td>
                    <Link to={`/students/${s.id}`}>
                      {s.displayName}
                    </Link>
                  </td>
                )
              }}
            />
          </CCol>
        )
      }
      <CCol xs={12} md={!isOwnClassOrAdmin ? 12 : 6}>
        <h4>Pelajar di Kelas</h4>
        <small>Pelajar yang sudah terdaftar di kelas</small>
        <CDataTable
          items={enrolledStudents}
          loading={updatingStudents || !isLoaded(students)}
          fields={[
            ...isOwnClassOrAdmin ? [{ key: "unenroll", label: "" }] : [],
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
            ),
            displayName: (s) => (
              <td>
                <Link to={`/students/${s.id}`}>
                  {s.displayName}
                </Link>
              </td>
            )
          }}
        />
      </CCol>
    </CRow>
  )
}

export function ClassSchedule({ classId }) {
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
          subcollections: [{
            collection: "schedules"
          }]
        }
      ],
      storeAs: "schedules"
    },
  ])
  const [schedules, schedulesLoading] = useGetOrdered("schedules");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const schedulesForCalendar = schedules?.map((s) => ({
    ...s,
    title: "Toleransi " + s.tolerance + " Menit",
    start: s.start.toDate(),
    end: s.end.toDate(),
  }))

  useEffect(() => {
    if (selectedEvent) {
      const selectedSchedule = schedulesForCalendar?.find((s) => s.id === selectedEvent.id);
      setSelectedEvent(selectedSchedule)
    }
  }, [schedules])

  function handleEventDrop(slot) {
    const { start, end, event } = slot;
    const payload = {
      start,
      end,
      day: start.getDay(),
      tolerance: 15,
      classId
    }
    dispatch(updateSchedule(classId, event.id, payload));
  }

  function handleEventClick(event) {
    setSelectedEvent(event);
  }

  function handleSelectSlot(slot) {
    const { start, end } = slot;
    const payload = {
      start,
      end,
      day: start.getDay(),
      tolerance: 15,
      classId
    }
    dispatch(createSchedule(classId, payload));
  }

  const profile = useGetProfile();
  const auth = useGetAuth();
  const classObj = useSelector((state) => state.firestore.data[`class/${classId}`]);

  const calendarProps = {
    defaultDate: moment(SCHEDULE_START_DATE_MS).toDate(),
    toolbar: false,
    views: [
      "week"
    ],
    defaultView: "week",
    localizer,
    style: { height: "500px" },
    events: schedulesForCalendar,
    components: {
      week: {
        header: ({ date, localizer }) => localizer.format(date, 'dddd')
      }
    },
    onSelectEvent: handleEventClick,
  }
  
  const dndCalendarProps = {
    selectable: true,
    resizable: true,
    onEventDrop: handleEventDrop,
    onSelectSlot: handleSelectSlot,
    onEventResize: handleEventDrop, 
  }

  const isOwnClassOrAdmin = classObj?.teacherIds?.includes(auth.uid) || profile.role !== "TEACHER";
  const isTeacherAndOwnClass = profile.role === "TEACHER" && classObj?.teacherIds?.includes(auth.uid);

  return (
    <>
      <ScheduleModal
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        isTeacherAndOwnClass={isTeacherAndOwnClass}
        isOwnClassOrAdmin={isOwnClassOrAdmin}
        classId={classId}
      />
      {
        schedulesLoading ? (
          <MESpinner/>
        ) : isOwnClassOrAdmin ? (
          <DnDCalendar
            {...calendarProps}
            {...dndCalendarProps}
          />
        ) : (
          <Calendar
            {...calendarProps}
          />
        )
      }
    </>
  )
}

export function ClassAttendances(props) {
  const { classId } = props;

  const schoolId = useGetSchoolId();

  useFirestoreConnect([
    {
      collection: "schools",
      doc: schoolId,
      subcollections: [{
        collection: "logs",
        where: [["classId", "==", classId]],
        orderBy: ["time", "desc"],

      }],
      storeAs: "logs"
    }, {
      collection: "users",
      where: [["role", "==", "STUDENT"]],
      storeAs: "students"
    }
  ])

  const [students] = useGetData("students");
  const [logs, logsLoading] = useGetOrdered("logs");
  const modifiedLogs = logs?.map((l) => ({ ...l, studentName: students?.[l.studentId]?.displayName }));

  const presentCount = logs?.filter((l) => l?.status === "PRESENT")?.length;
  const lateCount = logs?.filter((l) => l?.status === "LATE")?.length;
  const excusedCount = logs?.filter((l) => l?.status === "EXCUSED")?.length;
  const absentCount = logs?.filter((l) => l?.status === "ABSENT")?.length;

  const labels = [
    "Hadir",
    "Terlambat",
    "Izin",
    "Absen",
  ]
  const donutData = [
    {
      data: [presentCount, lateCount, excusedCount, absentCount],
      backgroundColor: [
        meColors.success.main,
        meColors.orange,
        meColors.yellow,
        meColors.danger,
      ],
    }
  ]

  const [status, setStatus] = useState("");

  return (
    <CRow className="mt-3">
      <CCol xs={12} sm={6}>
        <CDataTable
          items={modifiedLogs}
          pagination={true}
          itemsPerPage={10}
          columnFilter
          columnFilterValue={{
            status
          }}
          columnFilterSlot={{
            status: (
              <MESelect
                name="status"
                options={ATTENDANCE_STATUS_ENUM}
                onChange={(v) => setStatus(v || "")}
                value={status}
              />
            ),
            time: <></>
          }}
          loading={logsLoading}
          fields={[
            { key: "studentName", label: "Nama Pelajar" },
            { key: "time", label: "Tanggal & Waktu Kehadiran" },
            { key: "status", label: "Status" },
          ]}
          scopedSlots={{
            studentName: (l) => (
              <td>
                <Link to={`/students/${l.studentId}`}>
                  {l.studentName}
                </Link>
              </td>
            ),
            status: (l) => (
              <td style={{ color: getAttendanceStatusColor(l.status) }}>
                <strong>
                  {ATTENDANCE_STATUS_ENUM[l.status]}
                </strong>
              </td>
            ),
            time: (l) => (
              <td>
                {moment(l.time.toDate()).format("LLL")}
              </td>
            ),
          }}
        />
      </CCol>
      <CCol xs={12} sm={6}>
        <CChart
          type="doughnut"
          datasets={donutData}
          labels={labels}
        />
      </CCol>
    </CRow>
  )
}

export default function ClassDetails() {
  const firestore = useFirestore();
  const { classId } = useParams();
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
    }, 
  ])
  const classObj = useSelector((state) => state.firestore.data[`class/${classId}`]);

  useFirestoreConnect(classObj && {
    collection: "users",
    where: [[firestore.FieldPath.documentId(), "in", [classObj.createdBy, classObj.updatedBy, ...classObj.teacherIds]]],
    storeAs: "users"
  })

  const [updatedByUser] = useGetData("users", classObj?.updatedBy);
  const [createdByUser] = useGetData("users", classObj?.createdBy);
  const [teachers] = useGetOrdered("users", classObj?.teacherIds);

  
  const auth = useGetAuth();
  const profile = useGetProfile();
  const isOwnClassOrAdmin = classObj?.teacherIds?.includes(auth.uid) || profile.role !== "TEACHER";

  return (
    <CCard>
      <Helmet>
        <title>{classObj?.name || "Loading..."} - Detail Kelas</title>
      </Helmet>
      {
        classObj && isLoaded(classObj) ?  (
          <>
            <CCardHeader className="d-flex justify-content-between">
              <h3>Detail Kelas</h3>
              {
                profile.role !== "TEACHER" && (
                  <Link to={`/classes/${classId}/edit`}>
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
                  <CNavItem>
                    <CNavLink data-tab="students">
                      Pelajar
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink data-tab="attendances">
                      Kehadiran Kelas
                    </CNavLink>
                  </CNavItem>
                </CNav>
                <CTabContent>
                  <CTabPane data-tab="details">
                    <CRow className="mt-3">
                      <CCol xs={12} md={6}>
                        <label>Nama</label>
                        <h5>{classObj?.name}</h5>
                      </CCol>
                      <CCol xs={12} md={6}>
                        <label>Deskripsi</label>
                        <h5>{classObj?.description}</h5>
                      </CCol>
                      {
                        teachers?.length ? (
                          <CCol xs={12}>
                            <label>Pengajar</label>
                            {
                              teachers?.map((t, idx) => (
                                <Link key={idx} to={`/teachers/${t.id}`}>
                                  <h5>{t.displayName}</h5>
                                </Link>
                              ))
                            }
                          </CCol>
                        ) : null
                      }
                    </CRow>
                  </CTabPane>
                  <CTabPane data-tab="schedule">
                    <h4 className="mt-3 mb-0">Jadwal</h4>
                    <div className="mb-3">
                      <small>Jadwal yang dibuat akan diulang per minggu</small>
                    </div>
                    <ClassSchedule classId={classId}/>
                  </CTabPane>
                  <CTabPane data-tab="students">
                    <ClassStudents classId={classId}/>
                  </CTabPane>
                  <CTabPane data-tab="attendances">
                    <ClassAttendances classId={classId}/>
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
