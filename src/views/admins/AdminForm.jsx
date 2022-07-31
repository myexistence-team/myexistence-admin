import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CForm } from '@coreui/react'
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import { Link, useParams } from 'react-router-dom'
import meConfirm from 'src/components/meConfirm';
import METextField from 'src/components/METextField';
import { createAdmin } from 'src/store/actions/adminActions';
import { signUp } from 'src/store/actions/authActions';
import { object, string } from 'yup';

export default function AdminForm() {
  const { adminId } = useParams();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const admin = {};

  const editMode = Boolean(adminId);

  const adminSchema = object().shape({
    fullName: string().required(),
    email: string().required(),
    password: string(),
  })
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(adminSchema)
  })

  function onSubmit(data) {
    meConfirm({
      onConfirm: () => {
        dispatch(createAdmin(data))
      }
    })
  }
  
  return (
    <CCard>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CCardHeader>
          <h3>{editMode ? "Edit Admin" : "Tambahkan Admin"}</h3>
        </CCardHeader>
        <CCardBody>
          <METextField
            { ...register("fullName") }
            defaultValue={admin.fullName}
            errors={errors}
          />
          <METextField
            { ...register("email") }
            defaultValue={admin.email}
            errors={errors}
          />
          <METextField
            { ...register("password") }
            errors={errors}
          />
        </CCardBody>
        <CCardFooter className="d-flex justify-content-end">
          <CButton
            color="primary"
            variant="outline"
            is={Link}
            to="/admins"
          >
            Batal
          </CButton>
          <CButton
            color="primary"
            type="submit"
            className="ml-3"
          >
            Simpan
          </CButton>
        </CCardFooter>
      </CForm>
    </CCard>
  )
}
