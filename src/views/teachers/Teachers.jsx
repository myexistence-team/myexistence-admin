import { CButton, CCard, CCardBody, CCardHeader, CDataTable, CPagination } from '@coreui/react'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { isLoaded, useFirebaseConnect, useFirestoreConnect } from 'react-redux-firebase'
import { Link } from 'react-router-dom'
import { useFirestorePagination } from 'src/hooks/useFirestorePagination'
import useQueryString from 'src/hooks/useQueryString'
import { number } from 'yup'
import { object } from 'yup'

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 5;

export default function Teachers() {
  const { register, watch, setValue } = useForm();
  const [query] = useQueryString(object().shape({
    pageSize: number().default(DEFAULT_PAGE_SIZE),
  }), watch);
  const { pageSize } = query;

  const profile = useSelector((state) => state.firebase.profile);
  const schoolId = profile.schoolId;
  
  // const teachers = useSelector((state) => state.firestore.ordered.teachers);
  // const currLastTeacher = useMemo(() =teachers?.[teachers?.length - 1]);
  // console.log(currLastTeacher);
  // const teachers = [];

  const { 
    list: teachers, 
    handlePageChange, 
    page, 
  } = useFirestorePagination("teachers", query); 

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between">
        <h3>Pengajar</h3>
        <CButton
          color="primary"
          variant="outline"
        >
          + Tambahkan Pengajar
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          items={teachers}
          loading={!isLoaded(teachers)}
          fields={[
            "fullName",
            { key: "actions", label: "" }
          ]}
          scopedSlots={{
            fullName: (t) => (
              <td>
                <Link to={`/teachers/${t.id}`}>
                  {t.fullName}
                </Link>
              </td>
            ),
            actions: (t) => (
              <td className="d-flex justify-content-end">
                <Link to={`/teachers/${t.id}/edit`}>
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
