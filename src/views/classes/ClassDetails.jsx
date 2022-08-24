import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CDataTable, CForm, CModal, CModalBody, CModalFooter, CModalHeader, CNav, CNavItem, CNavLink, CRow, CTabContent, CTabPane, CTabs } from '@coreui/react';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { isLoaded, useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { Link, useParams } from 'react-router-dom'
import MESpinner from 'src/components/MESpinner';
import { useGetData, useGetOrdered, useGetSchoolId } from 'src/hooks/getters';
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { DAY_NUMBERS, SCHEDULE_START_DATE_MS } from 'src/constants';
import { createSchedule, deleteSchedule, updateSchedule } from 'src/store/actions/scheduleActions';
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
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export function ClassStudentAssign(props) {
  const {
    classId
  } = props;

  const dispatch = useDispatch();

  const schoolId = useGetSchoolId();
  const classObj = useGetData(`class/${classId}`);
  
  const [enrolledStudents, enrolledStudentsLoading] = useGetOrdered("students", classObj?.studentIds);
  const [studentsOrdered, studentsLoading] = useGetOrdered("students")
  const students = studentsOrdered?.filter((s) => !classObj?.studentIds?.includes(s.id));

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

  return (
    <CRow className="mt-3">
      <CCol xs={12} md={6}>
        <h4>Pelajar</h4>
        <CDataTable
          items={students}
          loading={updatingStudents || studentsLoading}
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
    title: "",
    start: s.start.toDate(),
    end: s.end.toDate(),
  }))

  function handleEventDrop(slot) {
    const { start, end, event } = slot;
    const payload = {
      start,
      end,
      day: start.getDay(),
      tolerance: 15
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

  return (
    <>
      <CModal 
        centered 
        show={Boolean(selectedEvent)}
        onClose={handleCancelEventEdit}
      >
        <CForm onSubmit={handleSubmit(onSubmitEvent)}>
          <CModalHeader className="d-flex justify-content-between">
            <h4>Edit Jadwal</h4>
            <CButton
              variant="outline"
              color="danger"
              onClick={handleDeleteEvent}
            >
              Hapus
            </CButton>
          </CModalHeader>
          <CModalBody>
            {
              Boolean(selectedEvent) && (
                <>
                  <MENativeSelect
                    { ...register("day") }
                    options={DAY_NUMBERS}
                    errors={errors}
                    label="Hari"
                  />
                  <METextField
                    { ...register("start") }
                    errors={errors}
                    type="time"
                    label="Jam Mulai"
                  />
                  <METextField
                    { ...register("end") }
                    errors={errors}
                    type="time"
                    label="Jam Selesai"
                  />
                  <METextField
                    { ...register("tolerance") }
                    errors={errors}
                    type="number"
                    label="Toleransi (dalam menit)"
                  />
                </>
              )
            }
          </CModalBody>
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
        </CForm>
      </CModal>
      {
        !schedulesLoading ? (
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
            onEventResize={handleEventDrop}
            selectable
            components={{
              week: {
                header: ({ date, localizer }) => localizer.format(date, 'dddd')
              }
            }}
          />
        ) : (
          <MESpinner/>
        )
      }
    </>
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
    where: [[firestore.FieldPath.documentId(), "in", [classObj.createdBy, classObj.updatedBy]]],
    storeAs: "users"
  })

  const updatedByUser = useGetData("users", classObj?.updatedBy);
  const createdByUser = useGetData("users", classObj?.createdBy);

  return (
    <CCard>
      <Helmet>
        <title>{classObj?.name} - Detail Kelas</title>
      </Helmet>
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
                    <ClassSchedule classId={classId}/>
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
