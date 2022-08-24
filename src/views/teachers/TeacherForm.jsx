import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CForm } from '@coreui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { isLoaded, useFirebase, useFirestore, useFirestoreConnect } from 'react-redux-firebase'
import { Link, useHistory, useParams } from 'react-router-dom'
import meConfirm from 'src/components/meConfirm'
import MESpinner from 'src/components/MESpinner'
import METextField from 'src/components/METextField'
import meToaster from 'src/components/toaster'
import { useGetAuth, useGetData, useGetProfile } from 'src/hooks/getters'
import { createTeacher, updateTeacher } from 'src/store/actions/teacherActions'
import { getProfile } from 'src/utils/getters'
import { string } from 'yup'
import { object } from 'yup'

export default function TeacherForm() {
  const { teacherId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const editMode = Boolean(teacherId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const schoolId = getProfile().schoolId;

  const teacherSchema = object().shape({
    displayName: string().required().strict(),
    idNumber: string().required().strict(),
    email: string().required().strict()
  })
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(teacherSchema)
  })

  useFirestoreConnect({
    collection: "users",
    doc: teacherId,
  })

  const teacher = useGetData("users", teacherId);

  function onSubmit(data) {
    meConfirm({
      onConfirm: () => {
        setIsSubmitting(true);
        dispatch(editMode ? updateTeacher(teacherId, data) : createTeacher(data))
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
        ) : editMode && !isLoaded(teacher) ? (
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
              <METextField
                { ...register("email") }
                errors={errors}
                defaultValue={teacher?.email}
              />
              <METextField
                { ...register("displayName") }
                errors={errors}
                defaultValue={teacher?.displayName}
              />
              <METextField
                { ...register("idNumber") }
                errors={errors}
                defaultValue={teacher?.idNumber}
              />
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
