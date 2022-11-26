import { CCol, CDataTable, CRow } from '@coreui/react';
import moment from 'moment';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useParams } from 'react-router-dom';
import MEControlledSelect from 'src/components/MEControlledSelect';
import MESelect from 'src/components/MESelect';
import METextField from 'src/components/METextField';
import { ATTENDANCE_STATUS_ENUM } from 'src/enums';
import { useGetData, useGetOrdered, useGetSchoolId } from 'src/hooks/getters';
import { getAttendanceStatusColor } from 'src/utils/utilFunctions';

export default function StudentDetailsAttendances() {
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
        ]
      }],
      storeAs: "logs"
    }
  ]);
  const [logs, logsLoading] = useGetOrdered("logs");

  const [status, setStatus] = useState("");
  const [classes] = useGetData("classes");
  const classesOrdered = useSelector((state) => state.firestore.ordered.classes);
  const [schedules] = useGetData("schedules");
  const schedulesOrdered = schedules ? Object.values(schedules)?.filter((s) => watch("classId")? s.classId === watch("classId") : true) : [];

  return (
    <div className="pt-3">
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
          status
        }}
        columnFilterSlot={{
          status: (
            <MESelect
              name="status"
              options={ATTENDANCE_STATUS_ENUM}
              onChange={(v) => setStatus(v || "")}
              value={status}
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
          )
        }}
        loading={logsLoading}
        fields={[
          { key: "time", label: "Tanggal & Waktu Kehadiran" },
          { key: "status", label: "Status" },
          { key: "classId", label: "Kelas" },
          { key: "scheduleId", label: "Jadwal" },
        ]}
        scopedSlots={{
          status: (l) => (
            <td style={{ color: getAttendanceStatusColor(l.status) }}>
              <strong>
                {ATTENDANCE_STATUS_ENUM[l.status]}
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
              {classes?.[l.classId]?.name}
            </td>
          ),
          scheduleId: (l) => {
            const schedule = schedules?.[l.scheduleId];
            return (
              <td>
                {`${moment(schedule.start.toDate()).format("dddd, HH:mm - ")} ${moment(schedule.end.toDate()).format("HH:mm")}`}
              </td>
            )
          }
        }}
      />
    </div>
  )
}
