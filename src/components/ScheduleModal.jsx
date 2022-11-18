import React, { useEffect, useState } from 'react'
import { CButton, CForm, CLabel, CModal, CModalBody, CModalFooter, CModalHeader } from '@coreui/react';
import MENativeSelect from './MENativeSelect';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import meConfirm from './meConfirm';
import { useDispatch } from 'react-redux';
import { closeSchedule, deleteSchedule, openSchedule, updateSchedule } from 'src/store/actions/scheduleActions';
import moment from 'moment';
import meToaster from './toaster';
import { DAY_NUMBERS, SCHEDULE_OPEN_METHODS } from 'src/constants';
import METextField from './METextField';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import ScheduleQRCode from './ScheduleQRCode';
import ScheduleCallout from './ScheduleCallout';
import { getCurrentScheduleTime } from 'src/utils/getters';
import { useGetData, useGetProfile } from 'src/hooks/getters';
import ScheduleStudentLogs from './ScheduleStudentLogs';
import { Link } from 'react-router-dom';

function ScheduleModal({
  schedule,
  setSelectedEvent,
  isTeacherAndOwnClass,
  isOwnClassOrAdmin,
  classId,
  onRefresh,
  showClassName = false,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const [statusLoading, setStatusLoading] = useState(false);
  const profile = useGetProfile();
  const firestore = useFirestore();

  const [classObj] = useGetData("classes", classId);

  useFirestoreConnect([{
    collection: "schools",
    doc: profile.schoolId,
    subcollections: [{
      collection: "classes",
      doc: classId,
      subcollections: [{
        collection: "schedules",
        doc: schedule.id,
        subcollections: [{
          collection: "studentLogs"
        }]
      }]
    }],
    storeAs: "studentLogs"
  }])

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
    if (schedule) {
      setValue("day", schedule.day.toString());
      setValue("tolerance", schedule.tolerance.toString());
      setValue("start", moment(schedule.start).format("HH:mm"));
      setValue("end", moment(schedule.end).format("HH:mm"));
    }
  }, [schedule])

  function handleDeleteEvent() {
    meConfirm({
      onConfirm: () => {
        dispatch(deleteSchedule(classId, schedule.id))
          .finally(() => {
            onRefresh();
            setSelectedEvent(null);
          })
      },
      confirmButtonColor: "danger"
    })
  }

  function handleOpenSchedule() {
    const currentScheduleTime = getCurrentScheduleTime();
    const startDiffInMs = schedule.start.getTime() - currentScheduleTime.getTime();
    const startDiffToNowInMins = Math.floor(startDiffInMs/60000);

    const endDiffInMs = schedule.end.getTime() - currentScheduleTime.getTime();
    const endDiffToNowInMins = Math.floor(endDiffInMs/60000);

    if (profile.currentScheduleId) {
      meToaster.warning("Anda masih menjalankan kelas. Mohon tutup kelas sebelumnya terlebih dahulu.");
    } else if (startDiffToNowInMins > 10) {
      meToaster.warning("Anda belum bisa buka kelas ini karena waktu mulai masih lebih dari 10 menit");
    } else if (endDiffToNowInMins < 0) {
      meToaster.warning("Anda tidak bisa buka kelas ini karena jadwal sudah selesai");
    } else {
      meConfirm({
        onConfirm: () => {
          if (navigator.geolocation) {
            setStatusLoading(true);
            navigator.geolocation.getCurrentPosition(
              ({ coords }) => {
                const location = new firestore.GeoPoint(coords.latitude, coords.longitude);
                dispatch(openSchedule(classId, schedule.id, location))
                  .then(() => {
                    setStatusLoading(false);
                  })
                  .catch((e) => {
                    setStatusLoading(false);
                    meToaster.danger(e.message);
                    console.error(e.message);
                  })
              },
              (positionError) => {
                alert(positionError.message);
              }
            );
          } else {
            alert("Browser Anda tidak men-support lokasi. Mohon buka menggunakan aplikasi Hadir");
            setStatusLoading(true);
          }
        }
      })
    }
  }

  const [calloutLoading, setCalloutLoading] = useState(false);
  function handleStudentCallouts() {
    meConfirm({
      onConfirm: () => {
        setCalloutLoading(true);
        dispatch(openSchedule(classId, schedule.id))
          .then(() => {
            onRefresh();
          })
      }
    })
  }

  const [isClosing, setIsClosing] = useState(false);
  function handleCloseSchedule() {
    if (schedule && schedule.status === "OPENED") {
      meConfirm({
        confirmButtonColor: "danger",
        onConfirm: () => {
          setIsClosing(true)
          dispatch(closeSchedule(classId, schedule.id, schedule))
            .finally(() => {
              onRefresh();
              setIsClosing(false);
            })
        }
      })
    }
  }

  function onSubmitEvent(data) {
    var startMoment = moment(schedule.start);
    const startSplit = data.start.split(":");

    var endMoment = moment(schedule.end);
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
    dispatch(updateSchedule(classId, schedule.id, payload))
      .then(() => {
        setSelectedEvent(null);
        onRefresh();
      })
      .catch((e) => {
        meToaster.danger(e.message)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <CModal
      centered 
      show={Boolean(schedule)}
      onClose={() => setSelectedEvent(null)}
      size={schedule?.status === "OPENED" && "lg"}
    >
      <CForm onSubmit={handleSubmit(onSubmitEvent)}>
        <CModalHeader className="d-flex justify-content-between">
          <h4>{isOwnClassOrAdmin ? "Edit Jadwal" : "Detail Jadwal"}</h4>
          {
            schedule?.status === "OPENED" ? (
              <CButton
                variant="outline"
                color="danger"
                onClick={handleCloseSchedule}
                disabled={isClosing}
              >
                Tutup Sesi
              </CButton>
            ) : isOwnClassOrAdmin ? (
              <CButton
                variant="outline"
                color="danger"
                onClick={handleDeleteEvent}
              >
                Hapus
              </CButton>
            ) : null
          }
        </CModalHeader>
        <CModalBody>
          {
            Boolean(schedule) && (
              <>
                {
                  schedule.status !== "OPENED" ? (
                    <>
                      {
                        showClassName && (
                          <>
                            <CLabel>Kelas</CLabel>
                            <Link to={`/classes/${classId}`}>
                              <h5>{classObj?.name}</h5>
                            </Link>
                          </>
                        )
                      }
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
                        isTeacherAndOwnClass && !profile?.currentScheduleId && (
                          <>
                            <CButton 
                              color="primary" 
                              size="lg" 
                              className="w-100"
                              onClick={handleOpenSchedule}
                              disabled={statusLoading}
                            >
                              Buka Kelas
                            </CButton>
                            <CButton 
                              color="primary" 
                              size="lg" 
                              className="w-100 mt-3"
                              onClick={handleStudentCallouts}
                            >
                              Panggil Pelajar
                            </CButton>
                          </>
                        )
                      }
                    </>
                  ) : schedule.openMethod === SCHEDULE_OPEN_METHODS.QR_CODE ? (
                    <ScheduleQRCode
                      classId={classId}
                      scheduleId={schedule.id}
                      schedule={schedule}
                    />
                  ) : schedule.openMethod === SCHEDULE_OPEN_METHODS.CALLOUT ? (
                    <ScheduleCallout
                      classId={classId}
                      scheduleId={schedule.id}
                      schedule={schedule}
                    />
                  ) : (
                    <ScheduleStudentLogs
                      classId={classId}
                      scheduleId={schedule.id}
                    />
                  )
                }
              </>
            )
          }
        </CModalBody>
        {
          Boolean(schedule) && schedule.status !== "OPENED" && isOwnClassOrAdmin && (
            <CModalFooter className="d-flex justify-content-end">
              <CButton
                color="primary"
                variant="outline"
                onClick={() => setSelectedEvent(null)}
              >
                Batal
              </CButton>
              <CButton
                color="primary"
                type="submit"
                className="ml-3"
                disabled={isSubmitting}
              >
                Simpan
              </CButton>
            </CModalFooter>
          )
        }
      </CForm>
    </CModal>
  )
}

export default ScheduleModal;
