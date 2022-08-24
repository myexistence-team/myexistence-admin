import { CButton, CCard, CCardBody, CContainer, CForm } from '@coreui/react'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import meColors from 'src/components/meColors';
import meConfirm from 'src/components/meConfirm';
import MEFirestoreSelect from 'src/components/MEFirestoreSelect';
import meToaster from 'src/components/toaster';
import { signUpForAccount } from 'src/store/actions/authActions';
import { checkSchoolExistanceThunk } from 'src/utils/checksFunctions';

export default function RegisterAccount() {
  const { control, handleSubmit } = useForm();
  const firebase = useSelector(state => state.firebase);
  const profile = firebase.profile;
  const history = useHistory();
  const dispatch = useDispatch();

  if (profile?.isLoaded && profile.schoolId) {
    history.replace("/")
  }

  const [confirmedSchoolId, setConfirmedSchoolId] = useState(null);

  function onSchoolSubmit(data) {
    dispatch(checkSchoolExistanceThunk(data.schoolId))
      .then(() => {
        // setConfirmedSchoolId(data.schoolId);
        dispatch(signUpForAccount(data))
          .then(() => {
            window.location.reload()
          })
          .catch((e) => {
            meToaster.warning(e.message)
          })
      })
      .catch((e) => {
        meToaster.warning(e.message)
      })
  }
  
  return (
    <div
      className="c-app c-default-layout flex-row align-items-center"
      style={{
        background: meColors.primary.main
      }}
    >
      <Helmet>
        <title>
          Register Account
        </title>
      </Helmet>
      <CContainer style={{
        maxWidth: 640
      }}>
        <CCard>
          <CCardBody>
            <CForm onSubmit={handleSubmit(onSchoolSubmit)}>
              <h4>Seperti nya Anda belum terdaftar. Mohon tanyakan Administrator menganai kode sekolah</h4>
              <MEFirestoreSelect
                control={control}
                name="schoolId"
                listName="schools"
                label={false}
                labelKey="name"
                placeholder="Cari Sekolah"
              />
              <CButton
                type="submit"
                color="primary"
                className="w-100"
              >
                Berikutnya
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  )
}
