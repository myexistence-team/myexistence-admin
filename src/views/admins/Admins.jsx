import { CButton, CCard, CCardBody, CCardHeader, CDataTable, CPagination } from '@coreui/react';
import React from 'react'
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form'
import { FaEdit, FaTrash } from 'react-icons/fa';
import { MdCheck } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import meConfirm from 'src/components/meConfirm';
import { ROLE_TYPES } from 'src/enums';
import { useGetAuth, useGetProfile, useGetSchoolId } from 'src/hooks/getters';
import { useFirestorePagination } from 'src/hooks/useFirestorePagination';
import useQueryString from 'src/hooks/useQueryString'
import { deleteAdmin } from 'src/store/actions/adminActions';
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

  const auth = useGetAuth();
  const profile = useGetProfile();
  const dispatch = useDispatch();

  function handleDelete(adminId) {
    meConfirm({
      confirmButtonColor: "danger",
      onConfirm: () => {
        dispatch(deleteAdmin(adminId));
      }
    })
  }

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
            { key: "isVerified", label: "Terverifikasi" },
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
                {
                  profile.role === "SUPER_ADMIN" && (
                    <CButton
                      color="danger"
                      variant="outline"
                      className="mr-3"
                      onClick={() => handleDelete(t.id)}
                    >
                      <FaTrash/>
                    </CButton>
                  )
                }
                {
                  (profile.role === "SUPER_ADMIN" || (profile.role === "ADMIN" && auth.uid === t.id)) && 
                  <Link to={`/admins/${t.id}/edit`}>
                    <CButton
                      color="primary"
                      variant="outline"
                    >
                      <FaEdit/>
                    </CButton>
                  </Link>
                }
              </td>
            ),
            isVerified: (t) => (
              <td>
                {t.isVerified && <MdCheck/>}
              </td>
            ),
          }}
          loading={isLoading}
        />
        <CPagination
          activePage={page + 1}
          onActivePageChange={(newPage) => handlePageChange(Math.max(0, newPage - 1))}
          pages={0}
          align="end"
        />
      </CCardBody>
    </CCard>
  )
}
