import { CButton, CCard, CCardBody, CContainer, CForm } from '@coreui/react'
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react'
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import meColors from 'src/components/meColors';
import meConfirm from 'src/components/meConfirm';
import MEFirestoreSelect from 'src/components/MEFirestoreSelect';
import MENativeSelect from 'src/components/MENativeSelect';
import meToaster from 'src/components/toaster';
import { signOut, signUpForAccount } from 'src/store/actions/authActions';
import { checkSchoolExistanceThunk } from 'src/utils/checksFunctions';
import { object, string } from 'yup';

export default function RegisterAccount() {
  const { register, control, handleSubmit } = useForm({
    resolver: yupResolver(object().shape({
      role: string().required(),
      schoolId: string().required(),
    }))
  });
  const firebase = useSelector(state => state.firebase);
  const profile = firebase.profile;
  const history = useHistory();
  const dispatch = useDispatch();

  if (profile?.isLoaded && profile.schoolId && profile.role) {
    history.replace("/")
  }

  async function handleSignOut() {
    await dispatch(signOut());
    await localStorage.clear();
    history.replace("/");
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
              <h4>Seperti nya Anda belum terdaftar. Mohon pilih sekolah yang Anda ikuti.</h4>
              <MENativeSelect
                { ...register("role") }
                options={[
                  { value: "TEACHER", label: "Pengajar" },
                  { value: "ADMIN", label: "Administrator" },
                ]}
                required
              />
              <MEFirestoreSelect
                control={control}
                name="schoolId"
                label={"Sekolah"}
                listName="schools"
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
              <CButton
                variant='outline'
                color="danger"
                className="w-100 mt-3"
                onClick={handleSignOut}
              >
                Keluar
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  )
}
