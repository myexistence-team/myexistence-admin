import { CButton, CCol, CLabel, CModal, CModalBody, CModalHeader, CRow } from '@coreui/react';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useDispatch } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import { DAY_NUMBERS, SCHEDULE_START_DATE_MS } from 'src/constants';
import { useGetAuth, useGetData, useGetProfile } from 'src/hooks/getters';
import { openSchedule } from 'src/store/actions/scheduleActions';
import { getCurrentScheduleTime } from 'src/utils/getters';
import meConfirm from './meConfirm';
import MESpinner from './MESpinner';
import ScheduleQRCode from './ScheduleQRCode';
import meToaster from './toaster';
moment.locale('id', {
  week: {
    dow: 1
  }
})
const localizer = momentLocalizer(moment);

export default function ScheduleCalendar(props) {
  const {
    events,
    style = {},
    onSelectEvent,
    loading = false,
    className,
    onRefresh
  } = props;

  const dispatch = useDispatch();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [classes] = useGetData("classes");

  function handleEventClick(event) {
    setSelectedEvent(event);
  }

  function handleCancelEventEdit() {
    setSelectedEvent(null);
  }

  useEffect(() => {
    if (selectedEvent) {
      const selectedSchedule = events?.find((s) => s.id === selectedEvent.id);
      setSelectedEvent(selectedSchedule)
    }
  }, [events])

  const calendarProps = {
    defaultDate: moment(SCHEDULE_START_DATE_MS).toDate(),
    toolbar: false,
    views: [
      "week"
    ],
    defaultView: "week",
    localizer,
    style: { ...style, height: "100%" },
    events,
    components: {
      week: {
        header: ({ date, localizer }) => localizer.format(date, 'dddd')
      }
    },
    onSelectEvent: onSelectEvent || handleEventClick,
  }

  const [locationLoading, setLocationLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const firestore = useFirestore();
  function handleOpenSchedule() {
    const currentScheduleTime = getCurrentScheduleTime();
    const startDiffInMs = selectedEvent.start.getTime() - currentScheduleTime.getTime();
    const startDiffToNowInMins = Math.floor(startDiffInMs/60000);
    
    const endDiffInMs = selectedEvent.end.getTime() - currentScheduleTime.getTime();
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
                dispatch(openSchedule(selectedEvent.classId, selectedEvent.id, location))
                  .then(() => {
                    setStatusLoading(false);
                  })
                  .catch((e) => {
                    setStatusLoading(false);
                    meToaster.danger(e.message);
                    console.error(e.message);
                  })
                  .finally(() => {
                    onRefresh !== undefined && onRefresh();
                  })
              }
            );
          } else {
            alert("Browser Anda tidak men-support lokasi. Mohon buka menggunakan aplikasi Hadir")
          }
        }
      })
    }
  }

  const profile = useGetProfile();
  const auth = useGetAuth();
  const isTeacherAndOwnClass = selectedEvent && profile.role === "TEACHER" && classes?.[selectedEvent.classId]?.teacherIds?.includes(auth.uid);

  return (
    <div className={className}>
      <CModal
        centered 
        show={Boolean(selectedEvent)}
        onClose={handleCancelEventEdit}
      >
        <CModalHeader className="d-flex justify-content-between">
          <h4>Detail Jadwal</h4>
        </CModalHeader>
        <CModalBody>
          {
            Boolean(selectedEvent) && (
              <>
                {
                  selectedEvent.status !== "OPENED" ? (
                    <CRow>
                      <CCol xs={12}>
                        <CLabel>Kelas</CLabel>
                        <Link to={`/classes/${selectedEvent.classId}`}>
                          <h5>{classes?.[selectedEvent.classId]?.name}</h5>
                        </Link>
                      </CCol>
                      <CCol xs={12}>
                        <CLabel>Hari</CLabel>
                        <h5>{DAY_NUMBERS[selectedEvent.day]}</h5>
                      </CCol>
                      <CCol xs={6}>
                        <CLabel>Jam Mulai</CLabel>
                        <h5>{moment(selectedEvent.start).format("HH:mm")}</h5>
                      </CCol>
                      <CCol xs={6}>
                        <CLabel>Jam Selesai</CLabel>
                        <h5>{moment(selectedEvent.end).format("HH:mm")}</h5>
                      </CCol>
                      <CCol xs={12}>
                        <CLabel>Toleransi</CLabel>
                        <h5>{selectedEvent.tolerance} menit</h5>
                      </CCol>
                      {
                        isTeacherAndOwnClass && (
                          <CCol xs={12}>
                            <CButton
                              color="primary" 
                              size="lg" 
                              className="w-100"
                              onClick={handleOpenSchedule}
                            >
                              Buka Kelas
                            </CButton>
                          </CCol>
                        )
                      }
                    </CRow>
                  ) : (
                    <ScheduleQRCode
                      classId={selectedEvent.classId}
                      scheduleId={selectedEvent.id}
                      schedule={selectedEvent}
                      onRefresh={onRefresh}
                    />
                  )
                }
              </>
            )
          }
        </CModalBody>
      </CModal>
      {
        loading ? (
          <MESpinner/>
        ) : (
          <Calendar
            {...calendarProps}
          />
        )
      }
    </div>
  )
}
