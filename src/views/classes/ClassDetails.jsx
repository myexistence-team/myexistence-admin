import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CNav, CNavItem, CNavLink, CRow, CTabContent, CTabPane, CTabs } from '@coreui/react';
import moment from 'moment';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { Link, useParams } from 'react-router-dom'
import MESpinner from 'src/components/MESpinner';
import { useGetData, useGetOrdered, useGetSchoolId } from 'src/hooks/getters';
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { SCHEDULE_START_DATE_MS } from 'src/constants';
import { createSchedule, updateSchedule } from 'src/store/actions/scheduleActions';
import { useDispatch } from 'react-redux';
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export default function ClassDetails() {
  const firestore = useFirestore();
  const { classId } = useParams();
  const dispatch = useDispatch();
  const startMock = new Date(262800000);
  const endMock = new Date(277200000);
  const [events, setEvents] = useState([{
    start: startMock,
    end: endMock,
    title: "Test"
  }]);

  const schoolId = useGetSchoolId();
  useFirestoreConnect({
    collection: "schoolds",

  })

  useFirestoreConnect([
    {
      collection: "schools",
      doc: schoolId,
      subcollections: [
        {
          collection: "classes",
          doc: classId,
          storeAs: "class",
        },
      ],
      storeAs: "class"
    }, {
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
  const classObj = useSelector((state) => state.firestore.data.class);
  const schedules = useGetOrdered("schedules");
  const schedulesForCalendar = schedules?.map((s) => ({
    ...s,
    title: "",
    start: s.start.toDate(),
    end: s.end.toDate(),
  }))

  useFirestoreConnect(classObj && {
    collection: "users",
    where: [[firestore.FieldPath.documentId(), "in", [classObj.createdBy, classObj.updatedBy]]],
    storeAs: "users"
  })

  const updatedByUser = useGetData("users", classObj?.updatedBy);
  const createdByUser = useGetData("users", classObj?.createdBy);

  function handleEventDrop(slot) {
    const { start, end, event } = slot;
    const payload = {
      start,
      end,
      day: start.getDay()
    }
    dispatch(updateSchedule(classId, event.id, payload));
  }

  function handleEventClick(event) {
    console.log(event);
  }

  function handleSelectSlot(slot) {
    const { start, end } = slot;
    const payload = {
      start,
      end,
      day: start.getDay()
    }
    dispatch(createSchedule(classId, payload));
  }

  return (
    <CCard>
      {
        !classObj ? (
          <MESpinner/>
        ) : (
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
                      selectable
                      components={{
                        week: {
                          header: ({ date, localizer }) => localizer.format(date, 'dddd')
                        }
                      }}
                    />
                  </CTabPane>
                  <CTabPane data-tab="students">
                    Pelajar
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
        )
      }
    </CCard>
  )
}
