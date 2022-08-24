import { CButton, CCard, CCardBody, CCardHeader, CDataTable, CPagination } from '@coreui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useFirestorePagination } from 'src/hooks/useFirestorePagination';
import useQueryString from 'src/hooks/useQueryString';
import { number, object } from 'yup';

export default function Classes() {
  const { register, watch } = useForm();
  const [query] = useQueryString(object().shape({
    pageSize: number().default(5)
  }), watch)

  const {
    isLoading,
    list: classes,
    handlePageChange,
    page,
  } = useFirestorePagination("classes", query)

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between">
        <h3>Kelas</h3>
        <Link to="/classes/add">
          <CButton
            variant="outline"
            color="primary"
          >
            + Tambahkan Kelas
          </CButton>
        </Link>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          items={classes}
          fields={[
            { key: "name", label: "Nama" },
            { key: "description", label: "Deskripsi" },
            { key: "studentCount", label: "Jumlah Pelajar" },
            { key: "actions", label: "" },
          ]}
          scopedSlots={{
            studentCount: (c) => (
              <td>
                {c.studentIds?.length}
              </td>
            ),
            name: (c) => (
              <td>
                <Link to={`/classes/${c.id}`}>
                  {c.name}
                </Link>
              </td>
            ),
            actions: (c) => (
              <td className="d-flex justify-content-end">
                <Link to={`/classes/${c.id}/edit`}>
                  <CButton
                    color="primary"
                    variant="outline"
                  >
                    Edit
                  </CButton>
                </Link>
              </td>
            )
          }}
          loading={isLoading}
        />
        {
          classes.length > 5 &&
          <CPagination
            activePage={page + 1}
            onActivePageChange={(newPage) => handlePageChange(Math.max(0, newPage - 1))}
            pages={0}
            align="end"
          />
        }
      </CCardBody>
    </CCard>
  )
}
