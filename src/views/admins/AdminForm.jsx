import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CForm, CInputCheckbox, CLabel } from '@coreui/react'
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom'
import meConfirm from 'src/components/meConfirm';
import meToaster from 'src/components/toaster';
import METextField from 'src/components/METextField';
import { createAdmin, updateAdmin } from 'src/store/actions/adminActions';
import { boolean, object, string } from 'yup';
import { useGetAuth, useGetData, useGetProfile } from 'src/hooks/getters';
import { isLoaded } from 'react-redux-firebase';
import MESpinner from 'src/components/MESpinner';
import { Helmet } from 'react-helmet';

export default function AdminForm() {
  const { adminId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [admin] = useGetData("users", adminId);

  const editMode = Boolean(adminId);

  const adminSchema = object().shape({
    displayName: string().required(),
    ...editMode ? { email: string().required() } : {},
    isVerified: boolean()
  })
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
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

  const auth = useGetAuth();
  const profile = useGetProfile();
  
  return (
    <CCard>
      {
        profile.role === "ADMIN" && auth.uid !== adminId ? (
          <CCardBody>
            <Helmet>
              <title>Tidak Dapat Izin</title>
            </Helmet>
            <h3>Anda tidak diizinkan untuk mengedit administrator lain.</h3>
          </CCardBody>
        ) : editMode && !isLoaded(admin) ? (
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
                <title>{editMode ? `${admin.displayName || "Loading..."} - Edit Admin` : "Tambahkan Admin"}</title>
              </Helmet>
            <CCardHeader>
              <h3>{editMode ? "Edit Admin" : "Tambahkan Admin"}</h3>
            </CCardHeader>
            <CCardBody>
              {
                !editMode && (
                  <METextField
                    { ...register("email") }
                    defaultValue={admin?.email}
                    errors={errors}
                    disabled={editMode}
                  />
                )
              }
              <METextField
                { ...register("displayName") }
                label="Nama Panjang"
                defaultValue={admin?.displayName}
                errors={errors}
              />
              {
                editMode && (
                  <div className="form-check">
                    <CInputCheckbox
                      id="isVerified"
                      checked={watch("isVerified")}
                      onClick={() => setValue("isVerified", !watch("isVerified"))}
                      defaultChecked={admin?.isVerified}
                    />
                    <CLabel htmlFor="isVerified">Terverifikasi</CLabel>
                  </div>
                )
              }
            </CCardBody>
            <CCardFooter className="d-flex justify-content-end">
              <Link to="/admins">
                <CButton
                  color="primary"
                  variant="outline"
                >
                  Batal
                </CButton>
              </Link>
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
