import { CButton, CCard, CCardBody, CContainer } from '@coreui/react';
import React from 'react'
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import meColors from 'src/components/meColors';
import { signOut } from 'src/store/actions/authActions';

export default function NotVerified() {
  const firebase = useSelector(state => state.firebase);
  const profile = firebase.profile;
  const history = useHistory();

  if (profile?.isVerified) {
    history.replace("/")
  }

  const dispatch = useDispatch();
  async function handleSignOut() {
    await dispatch(signOut());
    await localStorage.clear();
    history.replace("/");
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
          Belum Terverifikasi
        </title>
      </Helmet>
      <CContainer style={{
        maxWidth: 640
      }}>
        <CCard>
          <CCardBody>
            <h4>Belum Terverifikasi</h4>
            <p>Akun Anda belum terverifikasi. Mohon hubungi administrator sekolah Anda.</p>
            <CButton
              variant='outline'
              color="danger"
              className="w-100 mt-3"
              onClick={handleSignOut}
            >
              Keluar
            </CButton>
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  )
}
