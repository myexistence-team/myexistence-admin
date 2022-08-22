import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CForm } from '@coreui/react'
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import meConfirm from 'src/components/meConfirm';
import METextArea from 'src/components/METextArea';
import METextField from 'src/components/METextField';
import meToaster from 'src/components/toaster';
import { useGetData } from 'src/hooks/getters';
import { createClass, updateClass } from 'src/store/actions/classActions';
import { object, string } from 'yup';

export default function ClassForm(props) {
  const { classId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const admin = useGetData("classes", classId);

  const editMode = Boolean(classId);

  const classSchema = object().shape({
    name: string().required().strict(),
    description: string(),
  })
  const { register, handleSubmit, formState: { errors } } = useForm({
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
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CCardHeader>
          <h3>{editMode ? "Edit Kelas" : "Tambahkan Kelas"}</h3>
        </CCardHeader>
        <CCardBody>
          <METextField
            label="Nama"
            { ...register("name") }
            defaultValue={admin?.name}
            errors={errors}
          />
          <METextArea
            label="Deskripsi"
            rows={3}
            { ...register("description") }
            defaultValue={admin?.description}
            errors={errors}
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
    </CCard>
  )
}
