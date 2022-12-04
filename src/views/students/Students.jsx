import { CButton, CCard, CCardBody, CCardHeader, CDataTable, CPagination } from '@coreui/react'
import React from 'react'
import Avatar from 'react-avatar';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { MdCheck } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import meConfirm from 'src/components/meConfirm';
import { useGetProfile, useGetSchoolId } from 'src/hooks/getters';
import { useFirestorePagination } from 'src/hooks/useFirestorePagination';
import useQueryString from 'src/hooks/useQueryString';
import { deleteStudent } from 'src/store/actions/studentActions';
import { number, object } from 'yup';

export default function Students() {
  const { register, watch } = useForm();
  const [query] = useQueryString(object().shape({
    pageSize: number().default(5)
  }), watch)

  const profile = useGetProfile();

  const schoolId = useGetSchoolId();
  const {
    list: students,
    isLoading,
    handlePageChange,
    page,
  } = useFirestorePagination("users", query, [
    ["role", "==", "STUDENT"],
    ["schoolId", "==", schoolId]
  ])

  const dispatch = useDispatch();
  function handleDelete(studentId) {
    meConfirm({
      confirmButtonColor: "danger",
      onConfirm: () => {
        dispatch(deleteStudent(studentId));
      }
    })
  }

  return (
    <CCard>
      <Helmet>
        <title>Pelajar</title>
      </Helmet>
      <CCardHeader className="d-flex justify-content-between">
        <h3>Pelajar</h3>
        {
          profile.role !== "TEACHER" && (
            <Link to="/students/add">
              <CButton
                variant="outline"
                color="primary"
              >
                + Tambahkan Pelajar
              </CButton>
            </Link>
          )
        }
      </CCardHeader>   
      <CCardBody>
      <CDataTable
          items={students}
          fields={[
            { key: "profilePicture", label: "" },
            { key: "displayName", label: "Nama Lengkap" },
            "email",
            { key: "idNumber", label: "Nomor Induk" },
            { key: "isVerified", label: "Terverifikasi" },
            { key: "hasRegistered", label: "Terdaftar" },
            ...profile.role !== "TEACHER" ? [{ key: "actions", label: "" }] : [],
          ]}
          scopedSlots={{
            profilePicture: (t) => (
              <td style={{ width: "40px" }}>
                {
                  t.photoUrl && (
                    <Avatar
                      className="c-avatar-img"
                      name={t.displayName}
                      src={t?.photoUrl}
                      size="36"
                    />
                  )
                }
              </td>
            ),
            displayName: (t) => (
              <td>
                <Link to={`/students/${t.id}`}>
                  {t.displayName}
                </Link>
              </td>
            ),
            actions: (t) => (
              <td className="d-flex justify-content-end">
                {
                  profile.role !== "TEACHER" && (
                    <>
                      <CButton
                        color="danger"
                        variant="outline"
                        className="mr-3"
                        onClick={() => handleDelete(t.id)}
                      >
                        <FaTrash/>
                      </CButton>
                      <Link to={`/students/${t.id}/edit`}>
                        <CButton
                          color="primary"
                          variant="outline"
                        >
                          <FaEdit/>
                        </CButton>
                      </Link>
                    </>
                  )
                }
              </td>
            ),
            isVerified: (t) => (
              <td>
                {t.isVerified && <MdCheck/>}
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
