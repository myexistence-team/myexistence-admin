import { CButton, CCard, CCardBody, CCardHeader, CDataTable } from '@coreui/react';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux';
import { isLoaded, useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import useQueryString from 'src/hooks/useQueryString'
import { number } from 'yup';
import { object } from 'yup';

export default function Admins() {
  const { register, watch } = useForm();
  const profile = useSelector((s) => s.firebase.profile);
  console.log(profile)
  const [query] = useQueryString(object().shape({
    page: number().min(0),
    pageSize: number().min(1)
  }))
  const firestore = useFirestore();
  const { page, pageSize } = query;

  useFirestoreConnect([
    {
      collection: "users",
      where: [
        ["role", "==", "ADMIN"],
        ["schoolId", "==", profile.schoolId],
      ],
    }
  ])
  // const admins = firestore.collection("users").where("type", "==", "ADMIN").get().then((data) => console.log(data));
  const admins = useSelector((state) => state.firestore.ordered.users)

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between">
        <h3>Administrator</h3>
        <CButton
          color="primary"
          variant="outline"
          is={Link}
          to="/admins/add"
        >
          + Tambahkan Administrator
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          items={admins}
          fields={[
            { key: "fullName", label: "Nama Lengkap" },
            { key: "actions", label: "" }
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
            )
          }}
          loading={!isLoaded(admins)}
        />
      </CCardBody>
    </CCard>
  )
}
