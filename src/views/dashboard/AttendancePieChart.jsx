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
import { useGetOrdered, useGetSchoolId } from 'src/hooks/getters'

export default function AttendancePieChart() {

  const { register, watch } = useForm();

  const schoolId = useGetSchoolId();
  const nowFromMoment = moment(new Date()).add({days: -7}).toDate();
  const [now, setNow] = useState(nowFromMoment);

  useEffect(() => {
    setNow(moment(new Date()).add({days: -(parseInt(watch("timespan")))}).toDate())
  }, [watch("timespan")])

  useFirestoreConnect({
    collection: "schools",
    doc: schoolId,
    subcollections: [{
      collection: "logs",
      where: [["time", ">", now]],
    }],
    storeAs: "logs"
  })

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
        { ...register("timespan") }
        defaultValue={"7"}
        options={[
          { value: 7, label: "7 Hari Terakhir" },
          { value: 30, label: "30 Hari Terakhir" },
        ]}
      />
      {
        logsLoading ? (
          <MESpinner/>
        ) : logs?.length ? (
          <CChart
            type="doughnut"
            datasets={donutData}
            labels={labels}
          />
        ) : (
          <h5>Tidak ada data. Mohon coba ubah jangka waktu.</h5>
        )
      }
    </>
  )
}
