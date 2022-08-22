import { CButton, CCard, CCardBody, CCardHeader, CDataTable } from '@coreui/react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function Students() {
  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between">
        <h3>Pelajar</h3>
        <Link to="/classes/add">
          <CButton
            variant="outline"
            color="primary"
          >
            + Tambahkan Pelajar
          </CButton>
        </Link>
      </CCardHeader>   
      <CCardBody>
        <CDataTable>

        </CDataTable>
      </CCardBody>
    </CCard>
  )
}
