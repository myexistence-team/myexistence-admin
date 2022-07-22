import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CRow
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import fromApi from "src/actions/fromApi";
import useQueryString from "src/hooks/useQueryString";
import logAnalyticsEvent from "src/utils/logAnalyticsEvent";
import { object, string } from "yup";

const VerificationPage = () => {
  const dispatch = useDispatch();
  const [responseMessage, setResponseMessage] = useState(
    "Akun anda sedang di verifikasi ...."
  );
  const [query] = useQueryString(
    object().shape({
      token: string(),
      email: string()
    })
  );

  useEffect(() => {
    logAnalyticsEvent("viewed verification page", {}, null);
  }, []);

  useEffect(() => {
    if (query.email && query.token) {
      dispatch(
        fromApi.verifyAccount(
          encodeURIComponent(query.email.toLowerCase()),
          query.token
        )
      )
        .then(() => {
          setResponseMessage(
            `Verification Success! Please log back in to your account.`
          );
        })
        .catch(({ statusCode }) => {
          setResponseMessage(
            "Oops! There seems to be a problem with your URL."
          );
        });
    } else {
      setResponseMessage(
        "Oops! Invalid URL. Please try visiting the URL from your email again or try resending the URL."
      );
    }
  }, [dispatch, query.email, query.token]);

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="9" lg="7" xl="6">
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <h3>{responseMessage}</h3>
                {responseMessage.includes("Oops") && (
                  <Link to="/verify/resend">Resend Verification Link</Link>
                )}
                {/* <h3>Please log in to your account</h3> */}
                <CButton color="primary" is={Link} to="/login" className="mt-3">
                  Login
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};
export default VerificationPage;
