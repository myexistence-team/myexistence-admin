import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CForm, CInputCheckbox, CLabel, CRow } from '@coreui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { isLoaded, useFirebase, useFirestore, useFirestoreConnect } from 'react-redux-firebase'
import { Link, useHistory, useParams } from 'react-router-dom'
import meConfirm from 'src/components/meConfirm'
import MEDropzone from 'src/components/MEDropzone'
import MESpinner from 'src/components/MESpinner'
import METextArea from 'src/components/METextArea'
import METextField from 'src/components/METextField'
import meToaster from 'src/components/toaster'
import { useGetAuth, useGetData, useGetProfile } from 'src/hooks/getters'
import { createTeacher, updateTeacher } from 'src/store/actions/teacherActions'
import { boolean, string } from 'yup'
import { object } from 'yup'

export default function TeacherForm() {
  const { teacherId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const editMode = Boolean(teacherId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const teacherSchema = object().shape({
    displayName: string().required().strict(),
    description: string(),
    idNumber: string().required().strict(),
    email: string().required().strict(),
    isVerified: boolean()
  })
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(teacherSchema)
  })

  useFirestoreConnect({
    collection: "users",
    doc: teacherId,
  })

  const [teacher, teacherLoading] = useGetData("users", teacherId);

  useEffect(() => {
    if (teacher) {
      setProfileImageUrl(teacher.photoUrl);
    }
  }, [teacher])

  function onSubmit(data) {
    meConfirm({
      onConfirm: () => {
        setIsSubmitting(true);
        const payload = { ...data, profileImage, ...profileImageUrl ? { photoUrl: profileImageUrl } : {} };
        dispatch(editMode ? updateTeacher(teacherId, payload) : createTeacher(payload))
          .then(() => {
            history.push("/teachers")
          })
          .catch((e) => {
            console.log(e);
            meToaster.danger(e.message);
          })
          .finally(() => {
            setIsSubmitting(false);
          })
      }
    })
  }

  const auth = useGetAuth();
  const profile = useGetProfile();

  function handleFileDrop(files) {
    setProfileImage(files[0])
    setProfileImageUrl(URL.createObjectURL(files[0]));
  }

  function handleDeleteProfileImage() {
    setProfileImage(null)
    setProfileImageUrl(null);
  }

  return (
    <CCard>
      {
        profile.role === "TEACHER" && auth.uid !== teacherId ? (
          <CCardBody>
            <Helmet>
              <title>Tidak Dapat Izin</title>
            </Helmet>
            <h3>Anda tidak diizinkan untuk mengedit pengajar lain.</h3>
          </CCardBody>
        ) : editMode && teacherLoading ? (
          <MESpinner/>
        ) : editMode && !teacher ? (
          <CCardBody>
            <Helmet>
              <title>Pengajar Tidak Ditemukan</title>
            </Helmet>
            <h3>Pengajar dengan ID {teacherId} tidak ditemukan.</h3>
          </CCardBody>
        ) : (
          <CForm onSubmit={handleSubmit(onSubmit)}>
            <Helmet>
              <title>{editMode ? `${teacher.displayName || "Loading..."} - Edit Pengajar` : "Tambahkan Pengajar"}</title>
            </Helmet>
            <CCardHeader>
              <h3>{editMode ? "Edit Pengajar" : "Tambahkan Pengajar"}</h3>
            </CCardHeader>
            <CCardBody>
              <div className="mb-3">
                <CLabel>Foto Profil</CLabel>
                <CRow>
                  {
                    profileImageUrl && (
                      <CCol xs={4}>
                        <img
                          src={profileImageUrl}
                          alt="Profile Preview"
                          height="100%"
                          width="100%"
                        />
                      </CCol>
                    )
                  }
                  <CCol xs={profileImageUrl ? 8 : 12}>
                    <MEDropzone
                      inputProps={{
                        accept: ["image/*"],
                        multiple: false
                      }}
                      onDrop={handleFileDrop}
                    />
                    {
                      profileImageUrl && (
                        <CButton
                          color="warning"
                          variant="outline"
                          className="mt-2"
                          onClick={handleDeleteProfileImage}
                        >
                          Hapus Gambar Profil
                        </CButton>
                      )
                    }
                  </CCol>
                </CRow>
              </div>
              <METextField
                { ...register("email") }
                errors={errors}
                defaultValue={teacher?.email}
              />
              <METextField
                { ...register("displayName") }
                label="Nama Panjang"
                errors={errors}
                defaultValue={teacher?.displayName}
              />
              <METextArea
                { ...register("description") }
                label="Deskripsi"
                errors={errors}
                rows={3}
                defaultValue={teacher?.description}
              />
              <METextField
                { ...register("idNumber") }
                label="Nomor Induk"
                errors={errors}
                defaultValue={teacher?.idNumber}
              />
              {
                editMode && (
                  <div className="form-check">
                    <CInputCheckbox
                      id="isVerified"
                      checked={watch("isVerified")}
                      onClick={() => setValue("isVerified", !watch("isVerified"))}
                      defaultChecked={teacher?.isVerified}
                    />
                    <CLabel htmlFor="isVerified">Terverifikasi</CLabel>
                  </div>
                )
              }
            </CCardBody>
            <CCardFooter className="d-flex justify-content-end">
              <Link
                to="/teachers"
              >
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
