import { CButton, CCol, CRow } from '@coreui/react';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useDispatch } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useGetOrdered, useGetSchoolId } from 'src/hooks/getters';
import { closeSchedule } from 'src/store/actions/scheduleActions';
import { getCurrentScheduleTime } from 'src/utils/getters';
import meConfirm from './meConfirm';
import MESpinner from './MESpinner';
import ScheduleStudentLogs from './ScheduleStudentLogs';

export default function ScheduleQRCode({
  classId,
  scheduleId,
  schedule,
  onRefresh
}) {
  const dispatch = useDispatch();

  function handleCheckScheduleIsOpen() {
    const currentScheduleTime = getCurrentScheduleTime();
    const endDiffInMs = schedule.end.getTime() - currentScheduleTime.getTime();
    const endDiffToNowInMins = Math.floor(endDiffInMs/60000);
    if (endDiffToNowInMins < 0) {
      dispatch(closeSchedule(classId, scheduleId, schedule))
    }
  }

  useEffect(() => {
    handleCheckScheduleIsOpen()
  }, [])

  const schoolId = useGetSchoolId();
  useFirestoreConnect([
    {
      collection: "schools",
      doc: schoolId,
      subcollections: [
        {
          collection: "classes",
          doc: classId,
          subcollections: [{
            collection: "schedules",
            doc: scheduleId,
            subcollections: [{
              collection: "qrCodes",
              where: [
                ["scanned", "==", false]
              ]
            }]
          }]
        }
      ],
      storeAs: "qrCodes"
    }
  ])
  const [qrCodes, qrCodesLoading] = useGetOrdered("qrCodes");

  return (
    <CRow>
      <CCol xs={12} sm={8}>
        <div className="text-center">
          {
            !qrCodes && qrCodesLoading ? (
              <MESpinner/>
            ) : qrCodes && qrCodes.length === 0 ? (
              <h4>Semua pelajar sudah hadir untuk kelas ini!</h4>
            ) : (
              <QRCode
                value={qrCodes?.[0]?.id || ""}
              />
            )
          }
          <h5 className="my-4">Mohon tunjukkan QR Code ini kepada pelajar.</h5>
        </div>
      </CCol>
      <CCol xs={12} sm={4}>
        <ScheduleStudentLogs
          scheduleId={scheduleId}
          classId={classId}
        />
      </CCol>
    </CRow>
  )
}
