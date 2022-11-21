import { CButton, CCard, CCardBody, CCol, CLabel, CModal, CModalBody, CModalHeader, CRow } from '@coreui/react';
import React from 'react'
import { useState } from 'react';
import { FaWindowClose } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { EXCUSE_STATUSES } from 'src/constants';
import { ATTENDANCE_STATUS_ENUM, EXCUSE_TYPE_ENUM } from 'src/enums';
import { useGetOrdered } from 'src/hooks/getters';
import meColors from './meColors';
import MEPresenceIcon from './MEPresenceIcon';
import { GrClose } from 'react-icons/gr';
import { useDispatch } from 'react-redux';
import { changeExcuseStatus } from 'src/store/actions/scheduleActions';
import moment from 'moment/moment';
import { getAttendanceStatusColor } from 'src/utils/utilFunctions';
import StudentLogDetailsModal from './StudentLogDetailsModal';

export default function ScheduleStudentLogs({
  scheduleId,
  classId,
  currentStudentId,
}) {
  const dispatch = useDispatch();
  const studentLogs = useSelector((state) => state.firestore.ordered.studentLogs)?.filter((sl) => sl.scheduleId === scheduleId);
  const classObj = useSelector((state) => state.firestore.data[`class/${classId}`]);
  const [students] = useGetOrdered("students", classObj?.studentIds);

  const [selectedLogId, setSelectedStudentLogId] = useState(null);
  const selectedStudentLog = studentLogs?.find((sl) => sl.id === selectedLogId);
  console.log("CURRENT LOG", selectedStudentLog)

  const [excuseStatusLoading, setExcuseStatusLoading] = useState(null);
  function handleExcuseStatus(excuseStatus) {
    setExcuseStatusLoading(excuseStatus);
    dispatch(changeExcuseStatus({
      classId,
      scheduleId,
      studentLogId: selectedStudentLog.id,
      excuseStatus
    }))
      .then(() => {
        setSelectedStudentLogId(null);
        setExcuseStatusLoading(null);
      })
  }

  return (
    <>
      <StudentLogDetailsModal
        log={selectedStudentLog}
        setSelectedLogId={setSelectedStudentLogId}
        excuseStatusLoading={excuseStatusLoading}
        onExcuseChange={handleExcuseStatus}
      />
      {
        students?.length === 0 ? (
          <>Kelas ini tidak memiliki pelajar.</>
        ) : students?.map((student, sIdx) => {
          const studentLog = studentLogs?.find((sl) => sl.studentId === student.id);
          return (
            <CCard
              key={sIdx}
              style={{
                borderWidth: student.id === currentStudentId ? "1px" : "0px",
                borderStyle: "solid",
                borderColor: student.id === currentStudentId ? meColors.primary.main : null,
                cursor: studentLog && "pointer"
              }}
              onClick={() => studentLog ? setSelectedStudentLogId(studentLog.id) : undefined}
            >
              <CCardBody
                className="d-flex flex-row justify-content-between align-items-center"
              >
                {student.displayName}
                {
                  studentLog && (
                    <MEPresenceIcon status={studentLog.status}/>
                  )
                }
              </CCardBody>
            </CCard>
          )
        })
      }
    </>
  )
}