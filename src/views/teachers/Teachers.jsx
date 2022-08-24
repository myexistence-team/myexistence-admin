import { CButton, CCard, CCardBody, CCardHeader, CDataTable, CPagination } from '@coreui/react'
import moment from 'moment'
import React, { useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useForm } from 'react-hook-form'
import { MdCheck } from 'react-icons/md'
import { isLoaded } from 'react-redux-firebase'
import { Link } from 'react-router-dom'
import { useGetAuth, useGetProfile, useGetSchoolId } from 'src/hooks/getters'
import { useFirestorePagination } from 'src/hooks/useFirestorePagination'
import useQueryString from 'src/hooks/useQueryString'
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
            { key: "displayName", label: "Nama Lengkap" },
            "idNumber",
            "email",
            { key: "createdAt", label: "Tanggal Dibuat" },
            { key: "hasRegistered", label: "Terdaftar" },
            { key: "actions", label: "" },
          ]}
          scopedSlots={{
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
                  (profile.role !== "TEACHER" || selfUser.uid === t.id) && (
                    <Link to={`/teachers/${t.id}/edit`}>
                      <CButton
                        color="primary"
                        variant="outline"
                      >
                        Edit
                      </CButton>
                    </Link>
                  )
                }
              </td>
            ),
            hasRegistered: (t) => (
              <td>
                {t.hasRegistered && <MdCheck/>}
              </td>
            ),
            createdAt: (t) => (
              <td>
                {moment(t.createdAt?.toDate()).format("LLL")}
              </td>
            )
          }}
        />
        {
          teachers.length > 5 &&
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
