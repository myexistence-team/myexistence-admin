import { CButton, CCol, CRow } from '@coreui/react';
import React from 'react'
import { useState } from 'react'
import Avatar from 'react-avatar';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { PRESENCE_STATUSES } from 'src/constants';
import { useGetOrdered } from 'src/hooks/getters';
import { createStudentPresence } from 'src/store/actions/presenceActions';
import { closeSchedule } from 'src/store/actions/scheduleActions';
import meConfirm from './meConfirm';
import ScheduleStudentLogs from './ScheduleStudentLogs';
import meToaster from './toaster';

export default function ScheduleCallout({
  classId,
  scheduleId,
  schedule,
  onRefresh
}) {
  const [isClosing, setIsClosing] = useState(false);
  const dispatch = useDispatch();

  const classObj = useSelector((state) => state.firestore.data[`class/${classId}`]);

  const [students] = useGetOrdered("students", classObj?.studentIds);
  const studentLogs = useSelector((state) => state.firestore.ordered.studentLogs);

  const [currentStudentIdx, setCurrentStudentIdx] = useState(0);
  const currentStudent = students[currentStudentIdx];
  const currentStudentLog = studentLogs?.find((sl) => sl.studentId === currentStudent?.id);

  function handleCloseSchedule() {
    meConfirm({
      onConfirm: () => {
        setIsClosing(true);
        dispatch(closeSchedule(classId, scheduleId, schedule))
          .catch((e) => {
            meToaster.danger(e.message);
            console.error(e.message);
          })
          .finally(() => {
            setIsClosing(false);
          })
      }
    })
  }

  const [statusLoading, setStatusLoading] = useState(null);
  function handleCreateStudentPresence(status) {
    if (currentStudent) {
      setStatusLoading(status);
      dispatch(createStudentPresence({
        studentId: currentStudent.id,
        classId,
        scheduleId,
        status,
        studentLogId: currentStudentLog ? currentStudentLog.id : undefined
      }))
        .then(() => {
          setCurrentStudentIdx((prev) => prev + 1);
        })
        .finally(() => {
          setStatusLoading(null);
        })
    }
  }

  return (
    <CRow>
      <CCol xs={8}>
        {
          currentStudent ? (
            <CRow>
              <CCol xs={2}>
                {
                  currentStudentIdx > 0 && (
                    <CButton 
                      className="h-100 w-100" 
                      size="lg" 
                      color="primary" 
                      variant="ghost"
                      onClick={() => setCurrentStudentIdx((prev) => prev - 1)}
                    >
                      <BsChevronLeft/>
                    </CButton>
                  )
                }
              </CCol>
              <CCol xs={8}>
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <Avatar
                    src={currentStudent.photoUrl}
                    round
                    size={240}
                  />
                  <h4 className="my-3">
                    {currentStudent.displayName}
                  </h4>
                  <div className="d-flex">
                    <CButton 
                      size="lg"
                      color="danger"
                      className="mr-3"
                      variant={currentStudentLog?.status === PRESENCE_STATUSES.ABSENT ? null : "outline"}
                      disabled={statusLoading === PRESENCE_STATUSES.ABSENT}
                      onClick={() => handleCreateStudentPresence(PRESENCE_STATUSES.ABSENT)}
                    >
                      Absen
                    </CButton>
                    <CButton 
                      size="lg"
                      color="success"
                      variant={currentStudentLog?.status === PRESENCE_STATUSES.PRESENT ? null : "outline"}
                      disabled={statusLoading === PRESENCE_STATUSES.PRESENT}
                      onClick={() => handleCreateStudentPresence(PRESENCE_STATUSES.PRESENT)}
                    >
                      Hadir
                    </CButton>
                  </div>
                </div>
              </CCol>
              <CCol xs={2}>
                {
                  (currentStudentIdx < students.length - 1) && (
                    <CButton 
                      className="h-100 w-100" 
                      size="lg" 
                      color="primary" 
                      variant="ghost"
                      onClick={() => setCurrentStudentIdx((prev) => prev + 1)}
                    >
                      <BsChevronRight/>
                    </CButton>
                  )
                }
              </CCol>
            </CRow>
          ) : (
            <div className="text-center mt-4">
              <h5>Semua pelajar sudah tercatat! 👍</h5>
              <CButton
                color="primary"
                variant="outline"
                onClick={() => {
                  setCurrentStudentIdx(0);
                }}
              >
                Ulang Pencatatan
              </CButton>
            </div>
          )
        }
      </CCol>
      <CCol xs={4}>
        <ScheduleStudentLogs
          scheduleId={scheduleId}
          classId={classId}
          currentStudentId={currentStudent?.id}
        />
      </CCol>
    </CRow>
  )
}
