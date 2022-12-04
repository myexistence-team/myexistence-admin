import { CCol, CRow } from '@coreui/react';
import { CChart } from '@coreui/react-chartjs';
import React from 'react'
import { getAttendanceStatusColor, percentage } from 'src/utils/utilFunctions';
import meColors from './meColors';

export default function PresencesGraphs({
  logs,
  setStatus,
}) {
  const presentCount = logs?.filter((l) => l?.status === "PRESENT")?.length;
  const lateCount = logs?.filter((l) => l?.status === "LATE")?.length;
  const excusedCount = logs?.filter((l) => l?.status === "EXCUSED")?.length;
  const absentCount = logs?.filter((l) => l?.status === "ABSENT")?.length;
  const totalCount = logs?.length;

  const labels = [
    "Hadir",
    "Terlambat",
    "Izin",
    "Absen",
  ]
  const donutData = [
    {
      data: [presentCount, lateCount, excusedCount, absentCount],
      backgroundColor: [
        meColors.success.main,
        meColors.orange,
        meColors.yellow,
        meColors.danger,
      ],
    }
  ]

  return (
    <>
      <CRow>
        <CCol xs={6} className="mb-4">
          <div 
            className="rounded border p-3 text-center"
            style={{ cursor: "pointer" }}
            onClick={() => setStatus("PRESENT")}
          >
            <h5 style={{ color: getAttendanceStatusColor("PRESENT") }}>
              Hadir
            </h5>
            <h5 style={{ marginBottom: 0 }}>
              {presentCount} ({percentage(presentCount, totalCount)}%)
            </h5>
          </div>
        </CCol>
        <CCol xs={6} className="mb-4">
          <div 
            className="rounded border p-3 text-center"
            style={{ cursor: "pointer" }}
            onClick={() => setStatus("LATE")}
          >
            <h5 style={{ color: getAttendanceStatusColor("LATE") }}>
              Terlambat
            </h5>
            <h5 style={{ marginBottom: 0 }}>
              {lateCount} ({percentage(lateCount, totalCount)}%)
            </h5>
          </div>
        </CCol>
        <CCol xs={6} className="mb-4">
          <div 
            className="rounded border p-3 text-center"
            style={{ cursor: "pointer" }}
            onClick={() => setStatus("EXCUSED")}
          >
            <h5 style={{ color: getAttendanceStatusColor("EXCUSED") }}>
              Izin
            </h5>
            <h5 style={{ marginBottom: 0 }}>
              {excusedCount} ({percentage(excusedCount, totalCount)}%)
            </h5>
          </div>
        </CCol>
        <CCol xs={6} className="mb-4">
          <div 
            className="rounded border p-3 text-center"
            style={{ cursor: "pointer" }}
            onClick={() => setStatus("ABSENT")}
          >
            <h5 style={{ color: getAttendanceStatusColor("ABSENT") }}>
              Absen
            </h5>
            <h5 style={{ marginBottom: 0 }}>
              {absentCount} ({percentage(absentCount, totalCount)}%)
            </h5>
          </div>
        </CCol>
      </CRow>
      <CChart
        type="doughnut"
        datasets={donutData}
        labels={labels}
      />
    </>
  )
}
