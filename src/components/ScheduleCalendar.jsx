import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { SCHEDULE_START_DATE_MS } from 'src/constants';
import { useGetAuth, useGetData, useGetProfile } from 'src/hooks/getters';
import MESpinner from './MESpinner';
import ScheduleModal from './ScheduleModal';
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

  const [classes] = useGetData("classes");
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const selectedSchedule = events?.find((s) => s.id === selectedScheduleId);

  function handleEventClick(event) {
    setSelectedScheduleId(event.id);
    // setSelectedEvent(event);
  }

  // useEffect(() => {
  //   if (selectedSchedule) {
  //     const selectedSchedule = events?.find((s) => s.id === selectedEvent.id);
  //   setSelectedScheduleId(selectedEvent.id);
  //   setSelectedEvent(selectedSchedule)
  //   }
  // }, [events])

  const calendarProps = {
    defaultDate: moment(SCHEDULE_START_DATE_MS).toDate(),
    toolbar: false,
    views: [
      "week"
    ],
    defaultView: "week",
    localizer,
    style: { ...style, height: "100%" },
    events: events.map((e) => ({ 
      ...e, 
      start: e.start.toDate(), 
      end: e.end.toDate(), 
      title: e.title + (e.status === "OPENED" ? " (Berlangsung)" : "")
    })),
    components: {
      week: {
        header: ({ date, localizer }) => localizer.format(date, 'dddd')
      }
    },
    onSelectEvent: onSelectEvent || handleEventClick,
  }

  const profile = useGetProfile();
  const auth = useGetAuth();
  const isTeacherAndOwnClass = selectedSchedule && profile.role === "TEACHER" && classes?.[selectedSchedule.classId]?.teacherIds?.includes(auth.uid);
  const isOwnClassOrAdmin = profile.role !== "TEACHER";

  return (
    <div className={className}>
      {
        selectedSchedule && (
          <ScheduleModal
            // schedule={selectedEvent}
            schedule={selectedSchedule}
            setSelectedEvent={setSelectedScheduleId}
            isTeacherAndOwnClass={isTeacherAndOwnClass}
            isOwnClassOrAdmin={isOwnClassOrAdmin}
            showClassName={true}
            classId={selectedSchedule?.classId}
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
