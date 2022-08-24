import moment from 'moment';
import React from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { useHistory } from 'react-router-dom';
import MESpinner from 'src/components/MESpinner';
import { SCHEDULE_START_DATE_MS } from 'src/constants';
import { useGetData, useGetOrdered, useGetProfile, useGetSchoolId } from 'src/hooks/getters';
import { useFirestorePagination } from 'src/hooks/useFirestorePagination';
import useQueryString from 'src/hooks/useQueryString';
import { number, object } from 'yup';
const localizer = momentLocalizer(moment);

export default function MySchedule() {
  const history = useHistory();
  const firestore = useFirestore();
  const profile = useGetProfile();

  const schoolId = useGetSchoolId();
  const [classes, classesLoading] = useGetData("classes");

  useFirestoreConnect([
    {
      collection: "schools",
      doc: schoolId,
      subcollections: [{
        collection: "classes",
        where: [[firestore.FieldPath.documentId(), "in", profile?.classIds || []]],
      }],
      storeAs: "classes"
    }
  ])

  useFirestoreConnect([
    {
      collectionGroup: "schedules",
      where: [["classId", "in", profile.classIds]]
    }
  ])

  const [schedules, schedulesLoading] = useGetData("schedules");
  const schedulesOrdered = schedules ? Object.keys(schedules).map((sId) => ({ 
    ...schedules[sId],
    id: sId, 
    start: schedules[sId].start.toDate(),
    end: schedules[sId].end.toDate(),
    title: classes?.[schedules[sId].classId]?.name,
  })) : [];

  function handleEventClick(event) {
    history.push(`/classes/${event.classId}`);
  }

  const calendarProps = {
    defaultDate: moment(SCHEDULE_START_DATE_MS).toDate(),
    toolbar: false,
    views: [
      "week"
    ],
    defaultView: "week",
    localizer,
    style: { height: "500px" },
    events: schedulesOrdered,
    components: {
      week: {
        header: ({ date, localizer }) => localizer.format(date, 'dddd')
      }
    },
    onSelectEvent: handleEventClick,
  }

  return (
    <div>
      <Helmet>
        <title>Jadwal</title>
      </Helmet>
      {
        schedulesLoading ? (
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
