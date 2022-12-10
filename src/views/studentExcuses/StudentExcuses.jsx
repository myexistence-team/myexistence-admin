import { CButton, CCard, CCardBody, CCardHeader, CDataTable, CInputCheckbox, CLabel } from '@coreui/react'
import moment from 'moment';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase'
import { Link } from 'react-router-dom';
import meConfirm from 'src/components/meConfirm';
import MESelect from 'src/components/MESelect';
import StudentLogDetailsModal from 'src/components/StudentLogDetailsModal';
import { EXCUSE_STATUS_ENUM } from 'src/enums';
import { useGetData, useGetSchoolId } from 'src/hooks/getters'
import { changeSchoolLogExcuseStatus } from 'src/store/actions/scheduleActions';

export default function StudentExcuses() {
  const schoolId = useGetSchoolId();
  const dispatch = useDispatch();
  const firestore = useFirestore();
  const [waitingOnly, setWaitingOnly] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [combinedLogs, setStudentLogs] = useState([]);

  async function getStudentLogs() {
    setStudentLogs([]);
    const schoolLogsRef = firestore
      .collection("schools")
      .doc(schoolId)
      .collection("logs")
      .where("status", "==", "EXCUSED")
    const schoolStudentLogsRef = firestore
      .collectionGroup("studentLogs")
      .where("status", "==", "EXCUSED")
      .where("schoolId", "==", schoolId)
    if (waitingOnly) {
      schoolLogsRef.where("excuseStatus", "==", "WAITING");
      schoolStudentLogsRef.where("excuseStatus", "==", "WAITING");
    }
    schoolLogsRef.orderBy("time", "desc");
    schoolStudentLogsRef.orderBy("time", "desc");
    setIsLoading(true);
    const studentLogSnaps = await schoolStudentLogsRef.get();
    const logSnaps = await schoolLogsRef.get();
    setStudentLogs([...studentLogSnaps.docs, ...logSnaps.docs].map((doc) => ({
      ...doc.data(),
      id: doc.id
    })));
    setIsLoading(false)
  }

  useEffect(() => {
    getStudentLogs();
  }, [waitingOnly])
 
  useFirestoreConnect([
    {
      collection: "users",
      where: ["schoolId", "==", schoolId]
    }
  ])
  const [students] = useGetData("users");
  const modifiedLogs = combinedLogs?.map((l) => ({ ...l, studentName: students?.[l[1]?.studentId]?.displayName }));

  const [status, setStatus] = useState("");
  const [selectedLogId, setSelectedLogId] = useState(null);
  const selectedLog = combinedLogs.find((l) => l.id === selectedLogId);

  function handleSelectLog(logId) {
    setSelectedLogId(logId);
  }

  const [excuseStatusLoading, setExcuseStatusLoading] = useState(null);
  function handleExcuseStatusChange(excuseStatus) {
    meConfirm({
      onConfirm: () => {
        if (selectedLogId) {
          setExcuseStatusLoading(excuseStatus);
          dispatch(changeSchoolLogExcuseStatus({
            logId: selectedLogId,
            excuseStatus
          }))
            .then(() => {
              setSelectedLogId(null);
              setExcuseStatusLoading(null);
              getStudentLogs();
            })
        }
      }
    })
  }

  return (
    <CCard>
      <StudentLogDetailsModal
        log={selectedLog}
        excuseStatusLoading={excuseStatusLoading}
        onExcuseChange={handleExcuseStatusChange}
        setSelectedLogId={setSelectedLogId}
      />
      <CCardHeader className="d-flex justify-content-between">
        <h3>Permintaan Izin Pelajar</h3>
        <div className="form-check">
          <CInputCheckbox
            checked={!waitingOnly}
            onClick={() => setWaitingOnly(!waitingOnly)}
          />
          <CLabel htmlFor="isVerified">Tampilkan Semua</CLabel>
        </div>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          items={modifiedLogs}
          pagination={true}
          itemsPerPage={10}
          columnFilter
          columnFilterValue={{
            excuseStatus: status
          }}
          columnFilterSlot={{
            excuseStatus: (
              <MESelect
                name="status"
                options={EXCUSE_STATUS_ENUM}
                onChange={(v) => setStatus(v || "")}
                value={status}
              />
            ),
            time: <></>,
            actions: <></>
          }}
          loading={isLoading}
          fields={[
            { key: "studentName", label: "Nama Pelajar" },
            { key: "time", label: "Tanggal & Waktu Kehadiran" },
            { key: "excuseStatus", label: "Status" },
            { key: "actions", label: "" },
          ]}
          scopedSlots={{
            studentName: (l) => (
              <td>
                <Link to={`/students/${l.studentId}`}>
                  {l.studentName || "JJ Olatunji"}
                </Link>
              </td>
            ),
            excuseStatus: (l) => (
              <td>
                <strong>
                  {EXCUSE_STATUS_ENUM[l.excuseStatus]}
                </strong>
              </td>
            ),
            time: (l) => (
              <td>
                {moment(l.time?.toDate()).format("LLL")}
              </td>
            ),
            actions: (l) => (
              <td>
                <CButton 
                  color="primary"
                  variant="outline"
                  onClick={() => handleSelectLog(l.id)}
                >
                  Lihat Izin
                </CButton>
              </td>
            )
          }}
        />
      </CCardBody>
    </CCard>
  )
}
