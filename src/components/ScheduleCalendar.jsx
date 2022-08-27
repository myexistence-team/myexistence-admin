import { CCol, CLabel, CModal, CModalBody, CModalHeader, CRow } from '@coreui/react';
import moment from 'moment';
import React, { useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Link } from 'react-router-dom';
import { DAY_NUMBERS, SCHEDULE_START_DATE_MS } from 'src/constants';
import { useGetData } from 'src/hooks/getters';
import MESpinner from './MESpinner';
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
    className
  } = props;

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [classes] = useGetData("classes");

  function handleEventClick(event) {
    setSelectedEvent(event);
  }

  function handleCancelEventEdit() {
    setSelectedEvent(null);
  }

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
            selectedEvent && (
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
              </CRow>
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
