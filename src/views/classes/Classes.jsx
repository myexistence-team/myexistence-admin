import { CButton, CCard, CCardBody, CCardHeader, CDataTable, CPagination } from '@coreui/react'
import React from 'react'
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form'
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import meConfirm from 'src/components/meConfirm';
import { useGetProfile } from 'src/hooks/getters';
import { useFirestorePagination } from 'src/hooks/useFirestorePagination';
import useQueryString from 'src/hooks/useQueryString';
import { deleteClass } from 'src/store/actions/classActions';
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

  const profile = useGetProfile();

  const dispatch = useDispatch();
  function handleDelete(classId) {
    meConfirm({
      confirmButtonColor: "danger",
      onConfirm: () => {
        dispatch(deleteClass(classId));
      }
    })
  }

  return (
    <CCard>
      <Helmet>
        <title>Kelas</title>
      </Helmet>
      <CCardHeader className="d-flex justify-content-between">
        <h3>Kelas</h3>
        {
          profile.role !== "TEACHER" && (
            <Link to="/classes/add">
              <CButton
                variant="outline"
                color="primary"
              >
                + Tambahkan Kelas
              </CButton>
            </Link>
          )
        }
      </CCardHeader>
      <CCardBody>
        <CDataTable
          items={classes}
          fields={[
            { key: "name", label: "Nama" },
            { key: "description", label: "Deskripsi" },
            { key: "studentCount", label: "Jumlah Pelajar" },
            ...profile.role !== "TEACHER" ? [{ key: "actions", label: "" }] : [],
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
                {
                  profile.role !== "TEACHER" && (
                    <CButton
                      color="danger"
                      variant="outline"
                      className="mr-3"
                      onClick={() => handleDelete(c.id)}
                    >
                      <FaTrash/>
                    </CButton>
                  )
                }
                <Link to={`/classes/${c.id}/edit`}>
                  <CButton
                    color="primary"
                    variant="outline"
                  >
                    <FaEdit/>
                  </CButton>
                </Link>
              </td>
            )
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
