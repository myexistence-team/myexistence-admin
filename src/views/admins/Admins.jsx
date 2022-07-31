import { CButton, CCard, CCardBody, CCardHeader, CDataTable, CPagination } from '@coreui/react';
import React from 'react'
import { useForm } from 'react-hook-form'
import { MdCheck } from 'react-icons/md';
import { isLoaded } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import { useGetSchoolId } from 'src/hooks/getters';
import { useFirestorePagination } from 'src/hooks/useFirestorePagination';
import useQueryString from 'src/hooks/useQueryString'
import { number } from 'yup';
import { object } from 'yup';

export default function Admins() {
  const { register, watch } = useForm();
  const [query] = useQueryString(object().shape({
    pageSize: number().default(5)
  }), watch)

  const schoolId = useGetSchoolId();

  const { 
    list: admins, 
    handlePageChange, 
    page, 
  } = useFirestorePagination("users", query, [
    ["role", "==", "ADMIN"],
    ["schoolId", "==", schoolId]
  ]); 

  console.log(admins)

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between">
        <h3>Administrator</h3>
        <Link to="/admins/add">
          <CButton
            color="primary"
            variant="outline"
          >
            + Tambahkan Administrator
          </CButton>
        </Link>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          items={admins}
          fields={[
            { key: "fullName", label: "Nama Lengkap" },
            { key: "hasRegistered", label: "Terdaftar" },
            { key: "actions", label: "" },
          ]}
          scopedSlots={{
            fullName: (t) => (
              <td>
                <Link to={`/admins/${t.id}`}>
                  {t.fullName}
                </Link>
              </td>
            ),
            actions: (t) => (
              <td className="d-flex justify-content-end">
                <Link to={`/admins/${t.id}/edit`}>
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
          loading={!isLoaded(admins)}
        />
        {
          admins.length > 5 &&
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
