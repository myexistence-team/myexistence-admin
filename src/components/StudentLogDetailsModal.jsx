import { CButton, CCol, CLabel, CModal, CModalBody, CModalHeader, CRow } from '@coreui/react'
import moment from 'moment'
import React from 'react'
import { GrClose } from 'react-icons/gr'
import { EXCUSE_STATUSES } from 'src/constants'
import { ATTENDANCE_STATUS_ENUM, EXCUSE_TYPE_ENUM } from 'src/enums'
import { getAttendanceStatusColor } from 'src/utils/utilFunctions'

export default function StudentLogDetailsModal({
  log,
  setSelectedLogId,
  onExcuseChange,
  excuseStatusLoading
}) {
  return (
    <CModal show={log} centered>
      <CModalHeader className="d-flex justify-content-between align-items-center">
        <h4>Detail Kehadiran Pelajar</h4>
        <CButton
          onClick={() => setSelectedLogId(null)}
        >
          <GrClose/>
        </CButton>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <CCol xs={12} sm={6}>
            <CLabel>Status</CLabel>
            <h5 style={{ color: getAttendanceStatusColor(log?.status) }}>{ATTENDANCE_STATUS_ENUM[log?.status]}</h5>
          </CCol>
          <CCol xs={12} sm={6}>
            <CLabel>Jam Pencatatan</CLabel>
            <h5>{moment(log?.time?.toDate()).format("LLL")}</h5>
          </CCol>
        </CRow>
        {
          log?.excuse && (
            <>
              <CLabel>Tipe Izin</CLabel>
              <h5>{EXCUSE_TYPE_ENUM[log?.excuse?.type]}</h5>
              <CLabel>Alasan</CLabel>
              <h5>{log?.excuse?.message}</h5>
              <CLabel>Bukti</CLabel>
              <img
                alt={log?.excuse?.message}
                width={"100%"}
                height="100%"
                src={log?.excuse?.proofUrl}
              />
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
            </>
          )
        }
      </CModalBody>
    </CModal>
  )
}
