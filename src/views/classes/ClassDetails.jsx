import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CDataTable, CForm, CModal, CModalBody, CModalFooter, CModalHeader, CNav, CNavItem, CNavLink, CRow, CTabContent, CTabPane, CTabs } from '@coreui/react';
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
import { DAY_NUMBERS, SCHEDULE_START_DATE_MS } from 'src/constants';
import { createSchedule, deleteSchedule, openSchedule, updateSchedule } from 'src/store/actions/scheduleActions';
import { useDispatch } from 'react-redux';
import { MdArrowLeft, MdArrowRight } from 'react-icons/md';
import { ENROLLMENT_ACTIONS, updateClassStudent } from 'src/store/actions/classActions';
import meToaster from 'src/components/toaster';
import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import METextField from 'src/components/METextField';
import MENativeSelect from 'src/components/MENativeSelect';
import meConfirm from 'src/components/meConfirm';
import { Helmet } from 'react-helmet';
import ScheduleQRCode from 'src/components/ScheduleQRCode';
import { getCurrentScheduleTime } from 'src/utils/getters';
import { ATTENDANCE_STATUS_ENUM } from 'src/enums';
import { getAttendanceStatusColor } from 'src/utils/utilFunctions';
import meColors from 'src/components/meColors';
import { CChart } from '@coreui/react-chartjs';
import MESelect from 'src/components/MESelect';
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
    }
  ])
  const [schedules, schedulesLoading] = useGetOrdered("schedules");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const scheduleSchema = object().shape({
    start: string().required().strict(),
    end: string().required().strict(),
    day: string().required().strict(),
    tolerance: string().required().strict().default("15")
  })
  const { register, watch, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(scheduleSchema),
  })

  useEffect(() => {
    if (selectedEvent) {
      setValue("day", selectedEvent.day.toString());
      setValue("tolerance", selectedEvent.tolerance.toString());
      setValue("start", moment(selectedEvent.start).format("HH:mm"));
      setValue("end", moment(selectedEvent.end).format("HH:mm"));
    }
  }, [selectedEvent])

  function onSubmitEvent(data) {
    var startMoment = moment(selectedEvent.start);
    const startSplit = data.start.split(":");

    var endMoment = moment(selectedEvent.end);
    const endSplit = data.end.split(":");

    const payload = {
      day: parseInt(data.day),
      tolerance: parseInt(data.tolerance),
      start: (startMoment).set({
        day: parseInt(data.day),
        h: parseInt(startSplit[0]), 
        m: parseInt(startSplit[1])
      }).toDate(),
      end: (endMoment).set({
        day: parseInt(data.day),
        h: parseInt(endSplit[0]), 
        m: parseInt(endSplit[1])
      }).toDate(),
      classId
    }

    setIsSubmitting(true);
    dispatch(updateSchedule(classId, selectedEvent.id, payload))
      .then(() => {
        setSelectedEvent(null);
      })
      .catch((e) => {
        meToaster.danger(e.message)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  function handleCancelEventEdit() {
    setSelectedEvent(null);
  }

  function handleDeleteEvent() {
    meConfirm({
      onConfirm: () => {
        dispatch(deleteSchedule(classId, selectedEvent.id))
          .finally(() => {
            setSelectedEvent(null);
          })
      },
      confirmButtonColor: "danger"
    })
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

  function handleOpenSchedule() {
    const currentScheduleTime = getCurrentScheduleTime();
    const startDiffInMs = selectedEvent.start.getTime() - currentScheduleTime.getTime();
    const startDiffToNowInMins = Math.floor(startDiffInMs/60000);

    const endDiffInMs = selectedEvent.end.getTime() - currentScheduleTime.getTime();
    const endDiffToNowInMins = Math.floor(endDiffInMs/60000);

    if (startDiffToNowInMins > 10) {
      meToaster.warning("Anda belum bisa buka kelas ini karena waktu mulai masih lebih dari 10 menit")
    } else if (endDiffToNowInMins < 0) {
      meToaster.warning("Anda tidak bisa buka kelas ini karena jadwal sudah selesai")
    } else {
      meConfirm({
        onConfirm: () => {
          dispatch(openSchedule(classId, selectedEvent.id))
            .catch((e) => {
              meToaster.danger(e.message);
              console.log(e.message);
            })
        }
      })
    }
  }

  function handleStudentCallouts() {
    
  }

  return (
    <>
      <CModal 
        centered 
        show={Boolean(selectedEvent)}
        onClose={handleCancelEventEdit}
      >
        <CForm onSubmit={handleSubmit(onSubmitEvent)}>
          <CModalHeader className="d-flex justify-content-between">
            <h4>{isOwnClassOrAdmin ? "Edit Jadwal" : "Detail Jadwal"}</h4>
            {
              isOwnClassOrAdmin && (
                <CButton
                  variant="outline"
                  color="danger"
                  onClick={handleDeleteEvent}
                >
                  Hapus
                </CButton>
              )
            }
          </CModalHeader>
          <CModalBody>
            {
              Boolean(selectedEvent) && (
                <>
                  {
                    selectedEvent.status !== "OPENED" ? (
                      <>
                        <MENativeSelect
                          { ...register("day") }
                          options={DAY_NUMBERS}
                          errors={errors}
                          label="Hari"
                          disabled={!isOwnClassOrAdmin}
                        />
                        <METextField
                          { ...register("start") }
                          errors={errors}
                          type="time"
                          label="Jam Mulai"
                          disabled={!isOwnClassOrAdmin}
                        />
                        <METextField
                          { ...register("end") }
                          errors={errors}
                          type="time"
                          label="Jam Selesai"
                          disabled={!isOwnClassOrAdmin}
                        />
                        <METextField
                          { ...register("tolerance") }
                          errors={errors}
                          type="number"
                          label="Toleransi (dalam menit)"
                          disabled={!isOwnClassOrAdmin}
                        />
                        {
                          isTeacherAndOwnClass && (
                            <>
                              <CButton 
                                color="primary" 
                                size="lg" 
                                className="w-100"
                                onClick={handleOpenSchedule}
                              >
                                Buka Kelas
                              </CButton>
                              <CButton 
                                color="primary" 
                                size="lg" 
                                className="w-100"
                                onClick={handleStudentCallouts}
                              >
                                Panggil Pelajar
                              </CButton>
                            </>
                          )
                        }
                      </>
                    ) : (
                      <ScheduleQRCode
                        classId={classId}
                        scheduleId={selectedEvent.id}
                        schedule={selectedEvent}
                      />
                    )
                  }
                </>
              )
            }
          </CModalBody>
          {
            Boolean(selectedEvent) && selectedEvent.status !== "OPENED" && isOwnClassOrAdmin && (
              <CModalFooter className="d-flex justify-content-end">
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={handleCancelEventEdit}
                >
                  Batal
                </CButton>
                <CButton
                  color="primary"
                  type="submit"
                  className="ml-3"
                >
                  Simpan
                </CButton>
              </CModalFooter>
            )
          }
        </CForm>
      </CModal>
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
                              teachers?.map((t) => (
                                <Link to={`/teachers/${t.id}`}>
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
