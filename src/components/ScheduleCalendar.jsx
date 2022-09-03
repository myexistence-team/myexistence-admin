import { CButton, CCol, CLabel, CModal, CModalBody, CModalHeader, CRow } from '@coreui/react';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { DAY_NUMBERS, SCHEDULE_START_DATE_MS } from 'src/constants';
import { useGetData } from 'src/hooks/getters';
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
          dispatch(openSchedule(selectedEvent.classId, selectedEvent.id))
            .catch((e) => {
              meToaster.danger(e.message);
              console.log(e.message);
            })
            .finally(() => {
              onRefresh !== undefined && onRefresh();
            })
        }
      })
    }
  }

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
