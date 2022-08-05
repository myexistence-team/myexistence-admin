import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CForm, CRow } from '@coreui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react'
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { Link, useHistory, useParams } from 'react-router-dom'
import meConfirm from 'src/components/meConfirm';
import MENativeSelect from 'src/components/MENativeSelect';
import MESpinner from 'src/components/MESpinner';
import METextArea from 'src/components/METextArea';
import METextField from 'src/components/METextField';
import { SCHOOL_TYPES } from 'src/enums';
import { createSchool, editSchool } from 'src/store/actions/schoolActions';
import { object, string } from 'yup';

export default function SchoolForm() {
  // const { schoolId } = useParams();
  const profile = useSelector((state) => state.firebase.profile);
  const schoolId = profile.schoolId;
  const editMode = Boolean(schoolId);

  const schoolSchema = object().shape({
    name: string().required().strict(),
    location: string().required().strict(),
    type: string().required().strict(),
  })
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schoolSchema)
  })
  const dispatch = useDispatch();
  const history = useHistory();

  function onSubmit(data) {
    meConfirm({
      onConfirm: () => {
        dispatch(editSchool(data))
        .then(() => {
          history.push("/my-school")
        })
      }
    })
  }

  useFirestoreConnect([{
    collection: "schools",
    doc: schoolId
  }])

  const school = useSelector(({ firestore: { data } }) => data.schools && data.schools[schoolId]);

  return (
    <CCard>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        {
          editMode && !isLoaded(school) ? (
            <MESpinner/>
          ) : editMode && !school ? (
            <CCardBody>
              <Helmet>
                <title>School Not Found</title>
              </Helmet>
              <h3>School with ID {schoolId} is not found.</h3>
            </CCardBody>
          ) : (
            <>
              <CCardHeader>
                <h3>Edit Sekolahku</h3>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol xs={12} md={6}>
                    <METextField
                      { ...register("name") }
                      defaultValue={school.name}
                      errors={errors}
                    />
                  </CCol>
                  <CCol xs={12} md={6}>
                    <MENativeSelect
                      { ...register("type") }
                      defaultValue={school.type}
                      options={SCHOOL_TYPES}
                      placeholder="Enter School Type"
                      label="School Type"
                      errors={errors}
                    />
                  </CCol>
                  <CCol xs={12}>
                    <METextArea
                      { ...register("location") }
                      defaultValue={school.location}
                      errors={errors}
                    />
                  </CCol>
                </CRow>
              </CCardBody>
              <CCardFooter className="d-flex justify-content-end">
                <Link
                  to="/my-school"
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
