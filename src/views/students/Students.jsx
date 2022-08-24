import { CButton, CCard, CCardBody, CCardHeader, CDataTable, CPagination } from '@coreui/react'
import React from 'react'
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { MdCheck } from 'react-icons/md';
import { isLoaded } from 'react-redux-firebase';
import { Link } from 'react-router-dom'
import { useGetSchoolId } from 'src/hooks/getters';
import { useFirestorePagination } from 'src/hooks/useFirestorePagination';
import useQueryString from 'src/hooks/useQueryString';
import { number, object } from 'yup';

export default function Students() {
  const { register, watch } = useForm();
  const [query] = useQueryString(object().shape({
    pageSize: number().default(5)
  }), watch)

  const schoolId = useGetSchoolId();
  const {
    list: students,
    handlePageChange,
    page,
  } = useFirestorePagination("users", query, [
    ["role", "==", "STUDENT"],
    ["schoolId", "==", schoolId]
  ])

  return (
    <CCard>
      <Helmet>
        <title>Pelajar</title>
      </Helmet>
      <CCardHeader className="d-flex justify-content-between">
        <h3>Pelajar</h3>
        <Link to="/students/add">
          <CButton
            variant="outline"
            color="primary"
          >
            + Tambahkan Pelajar
          </CButton>
        </Link>
      </CCardHeader>   
      <CCardBody>
      <CDataTable
          items={students}
          fields={[
            { key: "displayName", label: "Nama Lengkap" },
            "email",
            { key: "hasRegistered", label: "Terdaftar" },
            { key: "actions", label: "" },
          ]}
          scopedSlots={{
            displayName: (t) => (
              <td>
                <Link to={`/students/${t.id}`}>
                  {t.displayName}
                </Link>
              </td>
            ),
            actions: (t) => (
              <td className="d-flex justify-content-end">
                <Link to={`/students/${t.id}/edit`}>
                  <CButton
                    color="primary"
                    variant="outline"
                  >
                    Edit
                  </CButton>
                </Link>
              </td>
            ),
            hasRegistered: (t) => (
              <td>
                {t.hasRegistered && <MdCheck/>}
              </td>
            ),
          }}
          loading={!isLoaded(students)}
        />
        {
          students.length > 5 &&
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
