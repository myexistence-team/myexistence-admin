import { CButton, CCard, CCardBody, CCardHeader, CDataTable, CInputCheckbox, CLabel } from '@coreui/react'
import moment from 'moment';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase'
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
  const [waitingOnly, setWaitingOnly] = useState(false);

  useFirestoreConnect([
    {
      collectionGroup: "logs",
      where: [
        ["schoolId", "==", schoolId],
        ["status", "==", "EXCUSED"],
        ...waitingOnly ? [["excuseStatus", "==", "WAITING"]] : []
      ],
      orderBy: ["time", "desc"]
    },
    {
      collectionGroup: "studentLogs",
      where: [
        ["schoolId", "==", schoolId],
        ["status", "==", "EXCUSED"],
        ...waitingOnly ? [["excuseStatus", "==", "WAITING"]] : []
      ],
      orderBy: ["time", "desc"]
    },
    {
      collection: "users",
      where: ["schoolId", "==", schoolId]
    }
  ])
  const [students] = useGetData("users");
  const [ logsState, logsLoading ] = useGetData("logs");
  const [ studentLogsState, studentLogsLoading ] = useGetData("studentLogs");
  const logs = Object.entries(studentLogsState || {}).concat(Object.entries(logsState || {}));
  const modifiedLogs = logs?.map((l) => ({ id: l[0], ...l[1], studentName: students?.[l[1].studentId]?.displayName }));

  const [status, setStatus] = useState("");
  const [selectedLogId, setSelectedLogId] = useState(null);
  const selectedLog = { ...logsState, ...studentLogsState }?.[selectedLogId];

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
          loading={logsLoading || studentLogsLoading}
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
                {moment(l.time.toDate()).format("LLL")}
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
