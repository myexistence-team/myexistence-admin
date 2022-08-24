import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CForm } from '@coreui/react'
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom'
import meConfirm from 'src/components/meConfirm';
import meToaster from 'src/components/toaster';
import METextField from 'src/components/METextField';
import { createAdmin, updateAdmin } from 'src/store/actions/adminActions';
import { object, string } from 'yup';
import { useGetData } from 'src/hooks/getters';
import { isLoaded } from 'react-redux-firebase';
import MESpinner from 'src/components/MESpinner';
import { Helmet } from 'react-helmet';

export default function AdminForm() {
  const { adminId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const admin = useGetData("users", adminId);

  const editMode = Boolean(adminId);

  const adminSchema = object().shape({
    displayName: string().required(),
    email: string().required(),
  })
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(adminSchema)
  })

  function onSubmit(data) {
    meConfirm({
      onConfirm: () => {
        setIsSubmitting(true);
        dispatch(editMode ? updateAdmin(adminId, data) : createAdmin(data))
          .then(() => {
            history.push("/admins")
          })
          .catch((e) => {
            meToaster.warning(e.message);
          })
          .finally((e) => {
            setIsSubmitting(false);
          })
      }
    })
  }
  
  return (
    <CCard>
      {
        editMode && !isLoaded(admin) ? (
          <MESpinner/>
        ) : editMode && !admin ? (
          <CCardBody>
            <Helmet>
              <title>Admin Tidak Ditemukan</title>
            </Helmet>
            <h3>Admin dengan ID {adminId} tidak ditemukan.</h3>
          </CCardBody>
        ) : (
          <CForm onSubmit={handleSubmit(onSubmit)}>
              <Helmet>
                <title>{editMode ? `${admin.displayName} - Edit Admin` : "Tambahkan Admin"}</title>
              </Helmet>
            <CCardHeader>
              <h3>{editMode ? "Edit Admin" : "Tambahkan Admin"}</h3>
            </CCardHeader>
            <CCardBody>
              <METextField
                { ...register("displayName") }
                defaultValue={admin?.displayName}
                errors={errors}
              />
              <METextField
                { ...register("email") }
                defaultValue={admin?.email}
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
                disabled={isSubmitting}
              >
                Simpan
              </CButton>
            </CCardFooter>
          </CForm>
        )
      }
    </CCard>
  )
}
