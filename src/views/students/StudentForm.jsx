import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CForm, CInputCheckbox, CLabel, CRow } from '@coreui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { Link, useHistory, useParams } from 'react-router-dom'
import meConfirm from 'src/components/meConfirm';
import MEDropzone from 'src/components/MEDropzone';
import MESpinner from 'src/components/MESpinner';
import METextArea from 'src/components/METextArea';
import METextField from 'src/components/METextField';
import meToaster from 'src/components/toaster';
import { useGetData } from 'src/hooks/getters';
import { createStudent, updateStudent } from 'src/store/actions/studentActions';
import { boolean, object, string } from 'yup';

export default function StudentForm() {
  const { studentId } = useParams();
  const editMode = Boolean(studentId);
  const dispatch = useDispatch();
  const history = useHistory(); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [profileImage, setProfileImage] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  const [student] = useGetData("users", studentId);

  const studentSchema = object().shape({
    displayName: string().required().strict(),
    description: string(),
    idNumber: string().required().strict(),
    email: string().email().required().strict(),
    isVerified: boolean()
  })
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(studentSchema)
  })

  useFirestoreConnect({
    collection: "users",
    doc: studentId,
  })

  function handleFileDrop(files) {
    setProfileImage(files[0])
    setPhotoUrl(URL.createObjectURL(files[0]));
  }

  function handleDeleteProfileImage() {
    setProfileImage(null)
    setPhotoUrl(null);
  }

  useEffect(() => {
    if (student) {
      setPhotoUrl(student.photoUrl);
    }
  }, [student])

  function onSubmit(data) {
    const payload = { ...data, profileImage, photoUrl };
    meConfirm({
      onConfirm: () => {
        setIsSubmitting(true);
        dispatch(editMode ? updateStudent(studentId, payload) : createStudent(payload))
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
          <div className="mb-3">
              <CLabel>Foto Profil</CLabel>
              <CRow>
                {
                  photoUrl && (
                    <CCol xs={4}>
                      <img
                        src={photoUrl}
                        alt="Profile Preview"
                        height="100%"
                        width="100%"
                      />
                    </CCol>
                  )
                }
                <CCol xs={photoUrl ? 8 : 12}>
                  <MEDropzone
                    inputProps={{
                      accept: ["image/*"],
                      multiple: false
                    }}
                    onDrop={handleFileDrop}
                  />
                  {
                    photoUrl && (
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
              defaultValue={student?.email}
              errors={errors}
              disabled={editMode}
            />
            <METextField
              { ...register("displayName") }
              label="Nama Panjang"
              defaultValue={student?.displayName}
              errors={errors}
            />
            <METextArea
              { ...register("description") }
              label="Deskripsi"
              rows={3}
              defaultValue={student?.description}
              errors={errors}
            />
            <METextField
              { ...register("idNumber") }
              label="Nomor Induk"
              errors={errors}
              defaultValue={student?.idNumber}
            />
            {
              editMode && (
                <div className="form-check">
                  <CInputCheckbox
                    id="isVerified"
                    checked={watch("isVerified")}
                    onClick={() => setValue("isVerified", !watch("isVerified"))}
                    defaultChecked={student?.isVerified}
                  />
                  <CLabel htmlFor="isVerified">Terverifikasi</CLabel>
                </div>
              )
            }
          </CCardBody>
          <CCardFooter className="d-flex justify-content-end">
            <Link to="/students">
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
