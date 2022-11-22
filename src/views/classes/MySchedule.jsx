import { CCard, CCardBody } from '@coreui/react';
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import ScheduleCalendar from 'src/components/ScheduleCalendar';
import { useGetData, useGetProfile, useGetSchoolId } from 'src/hooks/getters';

export default function MySchedule() {
  const firestore = useFirestore();
  const profile = useGetProfile();

  const schoolId = useGetSchoolId();
  const [classes] = useGetData("classes");

  useFirestoreConnect([
    ...profile.classIds?.length ? [{
      collection: "schools",
      doc: schoolId,
      subcollections: [{
        collection: "classes",
        where: [[firestore.FieldPath.documentId(), "in", profile?.classIds || []]],
      }],
      storeAs: "classes"
    }] : [],
  ])

  function handleGetSchedules() {
    firestore.get({
      collectionGroup: "schedules",
      where: [["classId", "in", profile.classIds]]
    })
  }

  function handleRefresh() {
    handleGetSchedules();
  }

  useEffect(() => {
    if (profile.classIds) {
      handleGetSchedules();
    }
  }, [profile])

  const [schedules, schedulesLoading] = useGetData("schedules");
  const schedulesOrdered = schedules ? Object.keys(schedules).map((sId) => ({ 
    ...schedules[sId],
    id: sId, 
    start: schedules[sId].start.toDate(),
    end: schedules[sId].end.toDate(),
    title: classes?.[schedules[sId].classId]?.name,
  })) : [];
  
  return (
    <div>
      <Helmet>
        <title>Jadwal</title>
      </Helmet>
      <CCard>
        <CCardBody>
          {
            profile.classIds?.length ? (
              <ScheduleCalendar
                events={schedulesOrdered}
                loading={schedulesLoading}
                onRefresh={handleRefresh}
              />
            ) : (
              <h4>Anda belum mengikuti kelas. Mohon hubungi administrator sekolah.</h4>
            )
          }
        </CCardBody>
      </CCard>
    </div>
  )
}
