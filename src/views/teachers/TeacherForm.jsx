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
import { useGetData } from 'src/hooks/getters'
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
    fullName: string().required().strict(),
    idNumber: string().required().strict(),
    email: string().required().strict()
  })
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(teacherSchema)
  })

  const firestore = useFirestore();
  useFirestoreConnect(teacherId && {
    collection: "schools",
    doc: schoolId,
    subcollections: [
      {
        collection: "teachers",
        where: [[firestore.FieldPath.documentId(), "==", teacherId]]
      }
    ],
    storeAs: "teachers",
  })

  const teacher = useGetData("teachers", teacherId);

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
          })
          .finally(() => {
            setIsSubmitting(false);
          })
      }
    })
  }

  return (
    <CCard>
      <CCardHeader>
        <h3>{editMode ? "Edit Pengajar" : "Tambahkan Pengajar"}</h3>
      </CCardHeader>
      <CForm onSubmit={handleSubmit(onSubmit)}>
          {
            editMode && !isLoaded(teacher) ? (
              <MESpinner/>
            ) : editMode && !teacher ? (
              <CCardBody>
                <Helmet>
                  <title>Teacher Not Found</title>
                </Helmet>
                <h3>Teacher with ID {teacherId} is not found.</h3>
              </CCardBody>
            ) : (
              <>              
                <CCardBody>
                  <METextField
                    { ...register("email") }
                    errors={errors}
                    defaultValue={teacher?.email}
                  />
                  <METextField
                    { ...register("fullName") }
                    errors={errors}
                    defaultValue={teacher?.fullName}
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
              </>
            )
          }
      </CForm>
    </CCard>
  )
}
