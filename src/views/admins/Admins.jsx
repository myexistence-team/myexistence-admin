import { CButton, CCard, CCardBody, CCardHeader, CDataTable, CPagination } from '@coreui/react';
import React from 'react'
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form'
import { MdCheck } from 'react-icons/md';
import { isLoaded } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import { ROLE_TYPES } from 'src/enums';
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
    isLoading,
    handlePageChange, 
    page, 
  } = useFirestorePagination("users", query, [
    ["role", "in", ["ADMIN", "SUPER_ADMIN"]],
    ["schoolId", "==", schoolId]
  ]); 

  return (
    <CCard>
      <Helmet>
        <title>Administrator</title>
      </Helmet>
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
            { key: "displayName", label: "Nama Lengkap" },
            "email",
            { key: "role", label: "Peran" },
            { key: "hasRegistered", label: "Terdaftar" },
            { key: "actions", label: "" },
          ]}
          scopedSlots={{
            role: (t) => (
              <td>
                {ROLE_TYPES[t.role]}
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
          loading={isLoading}
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
