import { CCard, CCardBody } from '@coreui/react';
import React from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetOrdered } from 'src/hooks/getters';
import meColors from './meColors';
import MEPresenceIcon from './MEPresenceIcon';
import { useDispatch } from 'react-redux';
import { changeExcuseStatus, changeLogStatus, changeSchoolLogStatus } from 'src/store/actions/scheduleActions';
import StudentLogDetailsModal from './StudentLogDetailsModal';
import meConfirm from './meConfirm';
import { createStudentPresence } from 'src/store/actions/presenceActions';


export default function ScheduleStudentLogs({
  scheduleId,
  classId,
  currentStudentId,
}) {
  const defaultLog = {
    id: "NEW",
    scheduleId,
    classId,
  }
  const dispatch = useDispatch();
  const studentLogs = useSelector((state) => state.firestore.ordered.studentLogs)?.filter((sl) => sl.scheduleId === scheduleId).concat([defaultLog]);
  const classObj = useSelector((state) => state.firestore.data[`class/${classId}`]);
  const [students] = useGetOrdered("students", classObj?.studentIds);

  const [selectedLogId, setSelectedStudentLogId] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const selectedStudentLog = studentLogs?.find((sl) => sl.id === selectedLogId);

  const [excuseStatusLoading, setExcuseStatusLoading] = useState(null);

  const [logStatusLoading, setLogStatusLoading] = useState(null);
  function handleLogStatusChange(status) {
    setLogStatusLoading(status);
    if (selectedStudentLog && selectedStudentId) {
      meConfirm({
        onConfirm: () => {
          dispatch(createStudentPresence({
            classId: selectedStudentLog.classId,
            scheduleId: selectedStudentLog.scheduleId,
            studentLogId: selectedLogId !== "NEW" ? selectedLogId : null,
            studentId: selectedStudentId,
            status
          }))
            .then(() => {
              setLogStatusLoading(null);
            })
        }
      })
    }
  }

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
        statusLoading={logStatusLoading}
        onExcuseChange={handleExcuseStatus}
        onStatusChange={handleLogStatusChange}
        canBeEdited={true}
      />
      {
        students?.length === 0 ? (
          <>Kelas ini tidak memiliki pelajar.</>
        ) : students?.map((student, sIdx) => {
          const studentLog = studentLogs?.find((sl) => sl.studentId === student.id) || defaultLog;
          return (
            <CCard
              key={sIdx}
              style={{
                borderWidth: student.id === currentStudentId ? "1px" : "0px",
                borderStyle: "solid",
                borderColor: student.id === currentStudentId ? meColors.primary.main : null,
                cursor: "pointer"
              }}
              onClick={() => {
                setSelectedStudentLogId(studentLog.id);
                setSelectedStudentId(student.id);
              }}
            >
              <CCardBody
                className="d-flex flex-row justify-content-between align-items-center"
              >
                {student.displayName}
                {
                  studentLog.status && (
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
