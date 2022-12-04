import { CButton, CCol, CDataTable, CRow } from '@coreui/react';
import moment from 'moment';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { Link, useParams } from 'react-router-dom';
import meConfirm from 'src/components/meConfirm';
import MEControlledSelect from 'src/components/MEControlledSelect';
import MESelect from 'src/components/MESelect';
import METextField from 'src/components/METextField';
import PresencesGraphs from 'src/components/PresencesGraphs';
import StudentLogDetailsModal from 'src/components/StudentLogDetailsModal';
import { ATTENDANCE_STATUS_ENUM, EXCUSE_STATUS_ENUM } from 'src/enums';
import { useGetData, useGetOrdered, useGetSchoolId } from 'src/hooks/getters';
import { changeExcuseStatus, changeSchoolLogStatus } from 'src/store/actions/scheduleActions';
import { getAttendanceStatusColor } from 'src/utils/utilFunctions';

export default function StudentDetailsAttendances() {
  const dispatch = useDispatch();
  const { studentId } = useParams();
  const [student] = useGetData("students", studentId);
  const schoolId = useGetSchoolId();

  const { register, watch, control } = useForm();
  useFirestoreConnect(student && [
    {
      collection: "schools",
      doc: schoolId,
      subcollections: [{
        collection: "logs",
        where: [
          ["studentId", "==", studentId],
          ["classId", "in", student?.classIds],
          ...watch("dateStart") ? [["time", ">=", new Date(watch("dateStart"))]] : [],
          ...watch("dateEnd") ? [["time", "<=", new Date(watch("dateEnd"))]] : [],
          ...watch("scheduleId") ? [["scheduleId", "==", watch("scheduleId")]] : [],
          ...watch("classId") ? [["classId", "==", watch("classId")]] : [],
        ],
        orderBy: ["time", "desc"]
      }],
      storeAs: "logs"
    }
  ]);
  const [logs, logsLoading] = useGetOrdered("logs");

  const [status, setStatus] = useState("");
  const [excuseStatus, setExcuseStatus] = useState("");

  const [classes] = useGetData("classes");
  const classesOrdered = useSelector((state) => state.firestore.ordered.classes);
  const [schedules] = useGetData("schedules");
  const schedulesOrdered = schedules ? Object.values(schedules)?.filter((s) => watch("classId")? s.classId === watch("classId") : true) : [];
  const [selectedLogId, setSelectedLogId] = useState(null);
  const selectedLog = logs?.find((l) => l.id === selectedLogId);

  function handleSelectLog(logId) {
    setSelectedLogId(logId);
  }

  const [excuseStatusLoading, setExcuseStatusLoading] = useState(null);
  const [logStatusLoading, setLogStatusLoading] = useState(null);
  function handleExcuseStatus(excuseStatus) {
    setExcuseStatusLoading(excuseStatus);
    if (selectedLog) {
      meConfirm({
        onConfirm: () => {
          dispatch(changeExcuseStatus({
            classId: selectedLog.classId,
            scheduleId: selectedLog.scheduleId,
            studentLogId: selectedLog.id,
            excuseStatus
          }))
            .then(() => {
              setSelectedLogId(null);
              setExcuseStatusLoading(null);
            })
        }
      })
    }
  }

  function handleLogStatusChange(status) {
    setLogStatusLoading(status);
    if (selectedLog) {
      meConfirm({
        onConfirm: () => {
          dispatch(changeSchoolLogStatus({
            logId: selectedLogId,
            status
          }))
            .then(() => {
              setLogStatusLoading(null);
            })
        }
      })
    }
  }

  return (
    <div className="pt-3">
      <StudentLogDetailsModal
        log={selectedLog}
        excuseStatusLoading={excuseStatusLoading}
        onExcuseChange={handleExcuseStatus}
        onStatusChange={handleLogStatusChange}
        statusLoading={logStatusLoading}
        setSelectedLogId={setSelectedLogId}
        showSchedule
      />
      <CRow>
        <CCol xs={12} sm={7}>
          <h5>Filter</h5>
          <CRow>
            <CCol xs={6}>
              <METextField
                { ...register("dateStart") }
                label="Dari"
                type="date"
              />
            </CCol>
            <CCol xs={6}>
              <METextField
                { ...register("dateEnd") }
                label="Sampai"
                type="date"
              />
            </CCol>
            <CCol xs={12}>
            </CCol>
          </CRow>
          <CDataTable
            items={logs}
            pagination={true}
            itemsPerPage={10}
            columnFilter
            columnFilterValue={{
              status,
              excuseStatus
            }}
            columnFilterSlot={{
              time: <></>,
              actions: <></>,
              status: (
                <MESelect
                  name="status"
                  options={ATTENDANCE_STATUS_ENUM}
                  onChange={(v) => setStatus(v || "")}
                  value={status}
                />
              ),
              excuseStatus: (
                <MESelect
                  name="excuseStatus"
                  options={EXCUSE_STATUS_ENUM}
                  onChange={(v) => setExcuseStatus(v || "")}
                  value={excuseStatus}
                />
              ),
              scheduleId: (
                <MEControlledSelect
                  control={control}
                  label={false}
                  className="mb-0"
                  name="scheduleId"
                  placeholder="Pilih Jadwal"
                  options={schedulesOrdered?.map((s) => ({
                    value: s.id,
                    label: `${watch("classId") ? "" : classes?.[s.classId]?.name + " - "}${moment(s.start.toDate()).format("dddd, HH:mm - ")} ${moment(s.end.toDate()).format("HH:mm")}`
                  }))}
                />
              ),
              classId: (
                <MEControlledSelect
                  control={control}
                  label={false}
                  className="mb-0"
                  name="classId"
                  placeholder="Pilih Kelas"
                  options={classesOrdered?.map((c) => ({
                    value: c.id,
                    label: c.name
                  }))}
                />
              ),
            }}
            loading={logsLoading}
            fields={[
              { key: "time", label: "Tanggal & Waktu Kehadiran" },
              { key: "classId", label: "Kelas" },
              { key: "scheduleId", label: "Jadwal" },
              { key: "status", label: "Status" },
              ...status === "EXCUSED" ? [{ key: "excuseStatus", label: "Status Izin" }] : [],
              { key: "actions", label: "" },
            ]}
            scopedSlots={{
              status: (l) => (
                <td style={{ color: getAttendanceStatusColor(l.status) }}>
                  <strong>
                    {ATTENDANCE_STATUS_ENUM[l.status]}
                  </strong>
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
              classId: (l) => (
                <td>
                  <Link to={`/classes/${l.classId}`}>
                    {classes?.[l.classId]?.name}
                  </Link>
                </td>
              ),
              scheduleId: (l) => {
                const schedule = schedules?.[l.scheduleId];
                return (
                  <td>
                    {`${moment(schedule.start.toDate()).format("dddd, HH:mm - ")} ${moment(schedule.end.toDate()).format("HH:mm")}`}
                  </td>
                )
              },
              actions: (l) => (
                <td>
                  <CButton
                    color="primary"
                    variant="outline"
                    onClick={() => handleSelectLog(l.id)}
                  >
                    Lihat
                  </CButton>
                </td>
              )
            }}
          />
        </CCol>
        <CCol xs={12} sm={5}>
          <PresencesGraphs
            logs={logs}
            setStatus={setStatus}
          />
        </CCol>
      </CRow>
    </div>
  )
}
