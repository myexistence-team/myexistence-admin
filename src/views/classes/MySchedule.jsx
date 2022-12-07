import { CCard, CCardBody } from '@coreui/react';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import MESpinner from 'src/components/MESpinner';
import ScheduleCalendar from 'src/components/ScheduleCalendar';
import { useGetData, useGetProfile, useGetSchoolId } from 'src/hooks/getters';

export default function MySchedule() {
  const firestore = useFirestore();
  const profile = useGetProfile();

  const schoolId = useGetSchoolId();
  const [classes] = useGetData("classes");

  useFirestoreConnect([
    ...profile.classIds?.length ? [
      {
        collection: "schools",
        doc: schoolId,
        subcollections: [{
          collection: "classes",
          where: [[firestore.FieldPath.documentId(), "in", profile?.classIds || []]],
        }],
        storeAs: "classes"
      }, 
      // {
      //   collection: "users",
      //   where: [
      //     ["classIds", "array-contains-any", profile?.classIds || []],
      //     ["role", "==", "STUDENT"],
      //   ]
      // }
    ] : [],
  ])

  const [isLoading, setIsLoading] = useState(false);
  async function handleGetSchedules() {
    setIsLoading(true);
    firestore.get({
      collectionGroup: "schedules",
      where: [["classId", "in", profile.classIds]]
    })
    setIsLoading(false);
  }

  function handleRefresh() {
    handleGetSchedules();
  }

  useEffect(() => {
    if (profile.classIds) {
      handleGetSchedules();
    }
  }, [profile])

  const [schedules] = useGetData("schedules");
  const schedulesOrdered = schedules ? Object.keys(schedules).map((sId) => ({ 
    ...schedules[sId],
    id: sId,
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
                loading={isLoading}
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
