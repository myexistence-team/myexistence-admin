import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CForm } from '@coreui/react'
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react'
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { Link, useHistory, useParams } from 'react-router-dom';
import meConfirm from 'src/components/meConfirm';
import MEFirestoreSelect from 'src/components/MEFirestoreSelect';
import MESpinner from 'src/components/MESpinner';
import METextArea from 'src/components/METextArea';
import METextField from 'src/components/METextField';
import meToaster from 'src/components/toaster';
import { useGetData, useGetSchoolId } from 'src/hooks/getters';
import { createClass, updateClass } from 'src/store/actions/classActions';
import { array, object, string } from 'yup';

export default function ClassForm(props) {
  const { classId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const classObj = useGetData(`class/${classId}`);

  const schoolId = useGetSchoolId();
  useFirestoreConnect([
    {
      collection: "schools",
      doc: schoolId,
      subcollections: [
        {
          collection: "classes",
          doc: classId,
        },
      ],
      storeAs: `class/${classId}`
    }
  ])

  const editMode = Boolean(classId);

  const classSchema = object().shape({
    name: string().required().strict(),
    description: string(),
    teacherIds: array().of(string()).default([]),
  })
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(classSchema)
  })

  function onSubmit(data) {
    meConfirm({
      onConfirm: () => {
        setIsSubmitting(true);
        dispatch(editMode ? updateClass(classId, data) : createClass(data))
          .then(() => {
            history.push("/classes")
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
        editMode && !isLoaded(classObj) ? (
          <MESpinner/>
        ) : editMode && !classObj ? (
          <CCardBody>
            <Helmet>
              <title>Kelas Tidak Ditemukan</title>
            </Helmet>
            <h3>Kelas dengan ID {classId} tidak ditemukan.</h3>
          </CCardBody>
        ) : (
          <CForm onSubmit={handleSubmit(onSubmit)}>
            <Helmet>
              <title>{editMode ? `Edit Kelas - ${classObj.name}` : "Tambahkan Kelas"}</title>
            </Helmet>
            <CCardHeader>
              <h3>{editMode ? "Edit Kelas" : "Tambahkan Kelas"}</h3>
            </CCardHeader>
            <CCardBody>
              <METextField
                label="Nama"
                { ...register("name") }
                defaultValue={classObj?.name}
                errors={errors}
              />
              <METextArea
                label="Deskripsi"
                rows={3}
                { ...register("description") }
                defaultValue={classObj?.description}
                errors={errors}
              />
              <MEFirestoreSelect
                control={control}
                defaultValue={classObj?.teacherIds}
                name="teacherIds"
                listName="users"
                label="Guru"
                where={["role", "==", "TEACHER"]}
                storeAs="teachers"
                isMulti
                labelKey="displayName"
              />
            </CCardBody>
            <CCardFooter className="d-flex justify-content-end">
              <CButton
                color="primary"
                variant="outline"
                is={Link}
                to="/classes"
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
