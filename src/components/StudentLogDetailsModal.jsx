import { CButton, CCol, CLabel, CModal, CModalBody, CModalHeader, CRow } from '@coreui/react'
import moment from 'moment'
import React from 'react'
import { GrClose } from 'react-icons/gr'
import { useSelector } from 'react-redux'
import { DAYS_ARRAY, EXCUSE_STATUSES, PRESENCE_STATUSES } from 'src/constants'
import { ATTENDANCE_STATUS_ENUM, EXCUSE_STATUS_ENUM, EXCUSE_TYPE_ENUM } from 'src/enums'
import { useGetProfile } from 'src/hooks/getters'
import { getAttendanceStatusColor } from 'src/utils/utilFunctions'

export default function StudentLogDetailsModal({
  log,
  setSelectedLogId,
  onExcuseChange,
  onStatusChange,
  excuseStatusLoading,
  statusLoading,
  showSchedule
}) {
  // const { schedule } = log;
  // console.log(schedule)
  const profile = useGetProfile();
  const classes = useSelector((state) => state.firestore.data.classes);
  const classroom = classes?.[log?.classId];

  return (
    <CModal show={log} centered closeOnBackdrop={false} size={log?.status === "EXCUSED" ? "xl" : "md"}>
      <CModalHeader className="d-flex justify-content-between align-items-center">
        <h4>{ !log?.excuse ? "Detail Kehadiran Pelajar" : "Detail Permintaan Izin" }</h4>
        <CButton
          onClick={() => setSelectedLogId(null)}
        >
          <GrClose/>
        </CButton>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <CCol md={12} lg={log?.status === "EXCUSED" ? 6 : 12}>
            <CRow>
              {
                showSchedule && (
                  <>
                    <CCol xs={12} sm={12}>
                      <CLabel>Kelas</CLabel>
                      <h5>{classroom?.name}</h5>
                    </CCol>
                    <CCol xs={12} sm={6}>
                      <CLabel>Hari</CLabel>
                      <h5>{DAYS_ARRAY[log?.schedule?.start?.toDate().getDay()]}</h5>
                    </CCol>
                    <CCol xs={12} sm={6}>
                      <CLabel>Jam</CLabel>
                      <h5>{moment(log?.schedule?.start?.toDate()).format("HH:mm")} - {moment(log?.schedule?.end?.toDate()).format("HH:mm")}</h5>
                    </CCol>
                  </>
                )
              }
              <CCol xs={12} sm={6}>
                <CLabel>Status</CLabel>
                <h5 style={{ color: getAttendanceStatusColor(log?.status) }}>{ATTENDANCE_STATUS_ENUM[log?.status]}</h5>
              </CCol>
              <CCol xs={12} sm={6}>
                <CLabel>Jam Pencatatan</CLabel>
                <h5>{moment(log?.time?.toDate()).format("LLL")}</h5>
              </CCol>
              {
                profile.role !== "TEACHER" && onStatusChange && !log?.excuse && (
                  <>
                    <CCol xs={4}>
                      <CButton
                        color="danger"
                        size="lg"
                        className="w-100"
                        variant={log?.status === PRESENCE_STATUSES.ABSENT ? null : "outline"}
                        disabled={statusLoading === PRESENCE_STATUSES.ABSENT}
                        onClick={() => onStatusChange(PRESENCE_STATUSES.ABSENT)}
                      >
                        Absen
                      </CButton>
                    </CCol>
                    <CCol xs={4}>
                      <CButton
                        color="warning"
                        size="lg"
                        className="w-100"
                        variant={log?.status === PRESENCE_STATUSES.LATE ? null : "outline"}
                        disabled={statusLoading === PRESENCE_STATUSES.LATE}
                        onClick={() => onStatusChange(PRESENCE_STATUSES.LATE)}
                      >
                        Terlambat
                      </CButton>
                    </CCol>
                    <CCol xs={4}>
                      <CButton
                        color="success"
                        size="lg"
                        className="w-100"
                        variant={log?.status === PRESENCE_STATUSES.PRESENT ? null : "outline"}
                        disabled={statusLoading === PRESENCE_STATUSES.PRESENT}
                        onClick={() => onStatusChange(PRESENCE_STATUSES.PRESENT)}
                      >
                        Hadir
                      </CButton>
                    </CCol>
                  </>
                )
              }
            </CRow>
            {
              log?.excuse && (
                <>
                  <CLabel>Tipe Izin</CLabel>
                  <h5>{EXCUSE_TYPE_ENUM[log?.excuse?.type]}</h5>
                  <CLabel>Alasan</CLabel>
                  <h5>{log?.excuse?.message}</h5>
                  {
                    profile.role !== "TEACHER" ? onExcuseChange ? (
                      <CRow className="mt-3">
                        <CCol xs={6}>
                          <CButton
                            color="danger"
                            size="lg"
                            className="w-100"
                            variant={log?.excuseStatus === EXCUSE_STATUSES.REJECTED ? null : "outline"}
                            disabled={excuseStatusLoading === EXCUSE_STATUSES.REJECTED}
                            onClick={() => onExcuseChange(EXCUSE_STATUSES.REJECTED)}
                          >
                            Tolak
                          </CButton>
                        </CCol>
                        <CCol xs={6}>
                          <CButton
                            color="success"
                            size="lg"
                            className="w-100"
                            variant={log?.excuseStatus === EXCUSE_STATUSES.ACCEPTED ? null : "outline"}
                            disabled={excuseStatusLoading === EXCUSE_STATUSES.ACCEPTED}
                            onClick={() => onExcuseChange(EXCUSE_STATUSES.ACCEPTED)}
                          >
                            Terima
                          </CButton>
                        </CCol>
                      </CRow>
                    ) : null : (
                      <>
                        <CLabel>Status Izin</CLabel>
                        <h5>{EXCUSE_STATUS_ENUM[log?.excuseStatus]}</h5>
                      </>
                    )
                  }
                </>
              )
            }
          </CCol>
          {
            log?.excuse && (
              <CCol md={12} lg={6} className="h-100">
                <CLabel>Bukti</CLabel>
                <img
                  alt={log?.excuse?.message}
                  width={"100%"}
                  height="100%"
                  src={log?.excuse?.proofUrl}
                />
              </CCol>
            )
          }
        </CRow>
      </CModalBody>
    </CModal>
  )
}
