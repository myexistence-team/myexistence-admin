import React, { useEffect, useState } from 'react'
import { CButton, CForm, CLabel, CModal, CModalBody, CModalFooter, CModalHeader } from '@coreui/react';
import MENativeSelect from './MENativeSelect';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import meConfirm from './meConfirm';
import { useDispatch, useSelector } from 'react-redux';
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
import { SCHEDULE_OPEN_METHODS_ENUM } from 'src/enums';
import { GrClose } from 'react-icons/gr';

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
  const [statusLoading, setStatusLoading] = useState(null);
  const profile = useGetProfile();
  const firestore = useFirestore();

  const classObj = useSelector((state) => state.firestore.data[`class/${classId}`]);

  useFirestoreConnect([
    {
      collection: "schools",
      doc: profile.schoolId,
      subcollections: [{
        collection: "classes",
        doc: classId,
      }],
      storeAs: `class/${classId}`
    },
    {
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
    }, {
      collection: "users",
      where: [
        ["role", "==", "STUDENT"],
        ["classIds", "array-contains", classId],
      ],
      storeAs: "students"
    }
  ])

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
      setValue("start", moment(schedule.start.toDate()).format("HH:mm"));
      setValue("end", moment(schedule.end.toDate()).format("HH:mm"));
    }
  }, [schedule])

  function handleDeleteEvent() {
    meConfirm({
      onConfirm: () => {
        dispatch(deleteSchedule(classId, schedule.id))
          .finally(() => {
            onRefresh && onRefresh();
            setSelectedEvent(null);
          })
      },
      confirmButtonColor: "danger"
    })
  }

  function handleOpenSchedule(openMethod) {
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
    }
    meConfirm({
      onConfirm: () => {
        handleOpenScheduleByMethod(openMethod)
      }
    })
  }

  function handleOpenScheduleByMethod(openMethod) {
    if (openMethod === SCHEDULE_OPEN_METHODS.GEOLOCATION) {
      if (navigator.geolocation) {
        setStatusLoading(openMethod);
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            const location = new firestore.GeoPoint(coords.latitude, coords.longitude);
            dispatch(openSchedule({ 
              classId, 
              scheduleId: schedule.id, 
              location,
              openMethod
            }))
              .then(() => {
                setStatusLoading(null);
                onRefresh && onRefresh();
              })
              .catch((e) => {
                setStatusLoading(null);
                meToaster.danger(e.message);
                console.error(e.message);
              })
          },
          (positionError) => {
            alert(positionError.message);
          }
        );
      } else {
        alert("Browser Anda tidak men-support lokasi. Mohon buka menggunakan aplikasi Hadir untuk membuka sesi kelas dengan geolocation");
        setStatusLoading(null);
      }
    } else {
      dispatch(openSchedule({
        classId, 
        scheduleId: schedule.id, 
        location: null,
        openMethod,
      }))
      .then(() => {
        setStatusLoading(null);
        onRefresh && onRefresh();
      })
      .catch((e) => {
        setStatusLoading(null);
        meToaster.danger(e.message);
        console.error(e.message);
      })
    }
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
              onRefresh && onRefresh();
              setIsClosing(false);
            })
        }
      })
    }
  }

  function onSubmitEvent(data) {
    var startMoment = moment(schedule.start.toDate());
    const startSplit = data.start.split(":");

    var endMoment = moment(schedule.end.toDate());
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
        onRefresh && onRefresh();
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
      closeOnBackdrop={false}
      show={Boolean(schedule)}
      onClose={() => setSelectedEvent(null)}
      size={(schedule?.status === "OPENED" && schedule?.openMethod !== SCHEDULE_OPEN_METHODS.GEOLOCATION) ? "lg" : null}
    >
      <CForm onSubmit={handleSubmit(onSubmitEvent)}>
        <CModalHeader className="d-flex justify-content-between">
          {
            isOwnClassOrAdmin ? "Edit Sesi Kelas" : (
              <>
                {
                  schedule.status !== "OPENED" ? (
                    <h4>Detail Sesi Kelas</h4>
                  ) : (
                    <h4>Sesi Kelas ({SCHEDULE_OPEN_METHODS_ENUM[schedule.openMethod]})</h4>
                  )
                }
              </>
            )
          }
          <div className="d-flex">
            {
              !isOwnClassOrAdmin && schedule?.status === "OPENED" ? (
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
            <CButton
              className="ml-3"
              onClick={() => setSelectedEvent(null)}
            >
              <GrClose/>
            </CButton>
          </div>
        </CModalHeader>
        <CModalBody>
          {
            Boolean(schedule) && (
              <>
                {
                  isOwnClassOrAdmin || schedule.status !== "OPENED" ? (
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
                        isTeacherAndOwnClass && (
                          <>
                            {
                              !profile?.currentScheduleId ? (
                                <>
                                  <div className="text-center mb-3">Buka sesi kelas menggunakan</div>
                                  {
                                    navigator.geolocation && (
                                      <CButton 
                                        color="primary" 
                                        size="lg" 
                                        className="w-100 mb-3"
                                        onClick={() => handleOpenSchedule(SCHEDULE_OPEN_METHODS.GEOLOCATION)}
                                        disabled={statusLoading === SCHEDULE_OPEN_METHODS.GEOLOCATION}
                                      >
                                        Deteksi Lokasi
                                      </CButton>
                                    )
                                  }
                                  <CButton 
                                    color="primary" 
                                    size="lg" 
                                    className="w-100 mb-3"
                                    onClick={() => handleOpenSchedule(SCHEDULE_OPEN_METHODS.QR_CODE)}
                                    disabled={statusLoading === SCHEDULE_OPEN_METHODS.QR_CODE}
                                  >
                                    QR Code
                                  </CButton>
                                  <CButton 
                                    color="primary" 
                                    size="lg" 
                                    className="w-100"
                                    onClick={() => handleOpenSchedule(SCHEDULE_OPEN_METHODS.CALLOUT)}
                                    disabled={statusLoading === SCHEDULE_OPEN_METHODS.CALLOUT}
                                  >
                                    Panggil Pelajar
                                  </CButton>
                                </>
                              ) : (
                                <div className="text-center mt-3">
                                  <h5>Anda sudah memiliki sesi kelas yang berlangsung.</h5>
                                </div>
                              )
                            }
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
          Boolean(schedule) && isOwnClassOrAdmin && (
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
