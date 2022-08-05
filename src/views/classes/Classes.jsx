import { CButton, CCard, CCardBody, CCardHeader, CDataTable } from '@coreui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

export default function Classes() {
  const { register } = useForm();

  

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between">
        <h3>Kelas</h3>
        <Link>
          <CButton
            variant="outline"
            color="primary"
          >
            + Tambahkan Kelas
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
