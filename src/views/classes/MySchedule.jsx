import { CButton, CCard, CCardBody, CCol, CLabel, CModal, CModalBody, CModalHeader, CRow } from '@coreui/react';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Helmet } from 'react-helmet';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { Link, useHistory } from 'react-router-dom';
import MESpinner from 'src/components/MESpinner';
import { DAY_NUMBERS, SCHEDULE_START_DATE_MS } from 'src/constants';
import { useGetData, useGetProfile, useGetSchoolId } from 'src/hooks/getters';
const localizer = momentLocalizer(moment);

export default function MySchedule() {
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
    },
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
  
  const [selectedEvent, setSelectedEvent] = useState(null);

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
    style: { height: "100%" },
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
      <Helmet>
        <title>Jadwal</title>
      </Helmet>
      <CCard>
        <CCardBody>
          {
            schedulesLoading ? (
              <MESpinner/>
            ) : (
              <Calendar
                {...calendarProps}
              />
            )
          }
        </CCardBody>
      </CCard>
    </div>
  )
}
