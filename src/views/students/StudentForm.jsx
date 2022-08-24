import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CForm } from '@coreui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react'
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import { Link, useHistory, useParams } from 'react-router-dom'
import meConfirm from 'src/components/meConfirm';
import MESpinner from 'src/components/MESpinner';
import METextField from 'src/components/METextField';
import meToaster from 'src/components/toaster';
import { useGetData } from 'src/hooks/getters';
import { createStudent, updateStudent } from 'src/store/actions/studentActions';
import { object, string } from 'yup';

export default function StudentForm() {
  const { studentId } = useParams();
  const editMode = Boolean(studentId);
  const dispatch = useDispatch();
  const history = useHistory(); 
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const student = useGetData("users", studentId);

  const studentSchema = object().shape({
    displayName: string().required().strict(),
    email: string().email().required().strict(),
  })
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(studentSchema)
  })

  function onSubmit(data) {
    meConfirm({
      onConfirm: () => {
        setIsSubmitting(true);
        dispatch(editMode ? updateStudent(studentId, data) : createStudent(data))
          .then(() => {
            history.push("/students")
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
        editMode && !isLoaded(student) ? (
          <MESpinner/>
        ) : editMode && !student ? (
          <CCardBody>
            <Helmet>
              <title>Pelajar Tidak Ditemukan</title>
            </Helmet>
            <h3>Pelajar dengan ID {studentId} tidak ditemukan.</h3>
          </CCardBody>
        ) : (
        <CForm onSubmit={handleSubmit(onSubmit)}>
            <Helmet>
              <title>{editMode ? `${student.displayName || "Loading..."} - Edit Pelajar` : "Tambahkan Pelajar"}</title>
            </Helmet>
            <CCardHeader>
              <h3>{editMode ? "Edit Pelajar" : "Tambahkan Pelajar"}</h3>
            </CCardHeader>
            <CCardBody>
              <METextField
                { ...register("displayName") }
                defaultValue={student?.displayName}
                errors={errors}
              />
              <METextField
                { ...register("email") }
                defaultValue={student?.email}
                errors={errors}
              />
            </CCardBody>
            <CCardFooter className="d-flex justify-content-end">
              <CButton
                color="primary"
                variant="outline"
                is={Link}
                to="/students"
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
