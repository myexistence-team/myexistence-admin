import { CButton, CCard, CCardBody, CCardHeader, CDataTable, CPagination } from '@coreui/react'
import moment from 'moment'
import React, { useMemo } from 'react'
import Avatar from 'react-avatar'
import { Helmet } from 'react-helmet'
import { useForm } from 'react-hook-form'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { MdCheck } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { isLoaded } from 'react-redux-firebase'
import { Link } from 'react-router-dom'
import meConfirm from 'src/components/meConfirm'
import { useGetAuth, useGetProfile, useGetSchoolId } from 'src/hooks/getters'
import { useFirestorePagination } from 'src/hooks/useFirestorePagination'
import useQueryString from 'src/hooks/useQueryString'
import { deleteTeacher } from 'src/store/actions/teacherActions'
import { number } from 'yup'
import { object } from 'yup'

const DEFAULT_PAGE_SIZE = 5;

export default function Teachers() {
  const { register, watch, setValue } = useForm();
  const [query] = useQueryString(object().shape({
    pageSize: number().default(DEFAULT_PAGE_SIZE),
  }), watch);

  const schoolId = useGetSchoolId();
  const selfUser = useGetAuth();
  const profile = useGetProfile();

  const { 
    list: teachers, 
    isLoading,
    handlePageChange, 
    page, 
  } = useFirestorePagination("users", query, [
    ["role", "==", "TEACHER"],
    ["schoolId", "==", schoolId]
  ]); 

  const dispatch = useDispatch();
  function handleDelete(teacherId) {
    meConfirm({
      confirmButtonColor: "danger",
      onConfirm: () => {
        dispatch(deleteTeacher(teacherId));
      }
    })
  }

  return (
    <CCard>
      <Helmet>
        <title>Pengajar</title>
      </Helmet>
      <CCardHeader className="d-flex justify-content-between">
        <h3>Pengajar</h3>
        {
          profile.role !== "TEACHER" && (
            <Link to="/teachers/add">
              <CButton
                color="primary"
                variant="outline"
              >
                + Tambahkan Pengajar
              </CButton>
            </Link>
          )
        }
      </CCardHeader>
      <CCardBody>
        <CDataTable
          items={teachers}
          loading={isLoading}
          fields={[
            { key: "profilePicture", label: "" },
            { key: "displayName", label: "Nama Lengkap" },
            "idNumber",
            "email",
            { key: "createdAt", label: "Tanggal Dibuat" },
            { key: "isVerified", label: "Terverifikasi" },
            { key: "actions", label: "" },
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
                <Link to={`/teachers/${t.id}`}>
                  {t.displayName}
                </Link>
              </td>
            ),
            actions: (t) => (
              <td className="d-flex justify-content-end">
                {
                  profile.role !== "TEACHER" && (
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
                  (profile.role !== "TEACHER" || selfUser.uid === t.id) && (
                    <Link to={`/teachers/${t.id}/edit`}>
                      <CButton
                        color="primary"
                        variant="outline"
                      >
                        <FaEdit/>
                      </CButton>
                    </Link>
                  )
                }
              </td>
            ),
            isVerified: (t) => (
              <td>
                {t.isVerified && <MdCheck/>}
              </td>
            ),
            createdAt: (t) => (
              <td>
                {moment(t.createdAt?.toDate()).format("LLL")}
              </td>
            )
          }}
        />
        <CPagination
          activePage={page + 1}
          doubleArrows={false}
          onActivePageChange={(newPage) => handlePageChange(Math.max(0, newPage - 1))}
          pages={0}
          align="end"
          oncha
        />
      </CCardBody>
    </CCard>
  )
}
