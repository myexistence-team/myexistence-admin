import { CChart } from '@coreui/react-chartjs'
import moment from 'moment'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useFirestoreConnect } from 'react-redux-firebase'
import meColors from 'src/components/meColors'
import MENativeSelect from 'src/components/MENativeSelect'
import MESpinner from 'src/components/MESpinner'
import PresencesGraphs from 'src/components/PresencesGraphs'
import { QUICK_DATES } from 'src/constants'
import { useGetOrdered, useGetSchoolId } from 'src/hooks/getters'
import { getStartOfMonth, getStartOfWeek, getStartOfYear } from 'src/utils/utilFunctions'

export default function AttendancePieChart() {

  const { register, watch } = useForm();

  const schoolId = useGetSchoolId();
  const nowFromMoment = moment(new Date()).add({days: -7}).toDate();
  const [now, setNow] = useState(nowFromMoment);

  const [dateStart, setDateStart] = useState(getStartOfWeek());
  const [dateEnd, setDateEnd] = useState(new Date());

  useEffect(() => {
    const quickDate = watch("quickDate");
    switch (quickDate) {
      case "WEEK":
        setDateStart(getStartOfWeek());
        setDateEnd(new Date());
        break;
      case "MONTH":
        setDateStart(getStartOfMonth());
        setDateEnd(new Date());
        break;
      case "YEAR":
        setDateStart(getStartOfYear());
        setDateEnd(new Date());
        break;
      default:
        setDateStart(getStartOfWeek())
        setDateEnd(new Date());

    }
  }, [watch('quickDate')])

  useFirestoreConnect( ...schoolId ? [{
    collection: "schools",
    doc: schoolId,
    subcollections: [{
      collection: "logs",
      where: [
        ["time", ">=", dateStart],
        ["time", "<=", dateEnd]
      ],
    }],
    storeAs: "logs"
  }] : [])

  const [logs, logsLoading] = useGetOrdered("logs");

  const presentCount = logs?.filter((l) => l?.status === "PRESENT")?.length;
  const lateCount = logs?.filter((l) => l?.status === "LATE")?.length;
  const excusedCount = logs?.filter((l) => l?.status === "EXCUSED")?.length;
  const absentCount = logs?.filter((l) => l?.status === "ABSENT")?.length;

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
      <MENativeSelect
        label="Jangka Waktu"
        className="mb-0"
        { ...register("quickDate") }
        defaultValue={"WEEK"}
        options={[
          { value: "WEEK", label: "Minggu Ini" },
          { value: "MONTH", label: "Bulan Ini" },
          { value: "YEAR", label: "Tahun Ini" },
        ]}
      />
      <p className="mb-3">
        <small>Dihitung dari tanggal {moment(dateStart).format("LL")}</small>
      </p>
      {
        logsLoading ? (
          <MESpinner/>
        ) : logs?.length ? (
          <PresencesGraphs
            logs={logs}
          />
        ) : (
          <h5>Tidak ada data. Mohon coba ubah jangka waktu.</h5>
        )
      }
    </>
  )
}
