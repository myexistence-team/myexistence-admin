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
import ScheduleModal from './ScheduleModal';
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

  function handleRefresh() {
    onRefresh && onRefresh();
  }

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

  const profile = useGetProfile();
  const auth = useGetAuth();
  const isTeacherAndOwnClass = selectedEvent && profile.role === "TEACHER" && classes?.[selectedEvent.classId]?.teacherIds?.includes(auth.uid);

  return (
    <div className={className}>
      {
        selectedEvent && (
          <ScheduleModal
            schedule={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            isTeacherAndOwnClass={isTeacherAndOwnClass}
            isOwnClassOrAdmin={true}
            showClassName={true}
            classId={selectedEvent?.classId}
            onRefresh={handleRefresh}
          />
        )
      }
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
