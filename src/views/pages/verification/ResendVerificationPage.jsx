import CIcon from "@coreui/icons-react";
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormGroup,
  CFormText,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CLabel,
  CRow
} from "@coreui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import fromApi from "src/actions/fromApi";
import meToaster from "src/components/toaster";
import { object, string } from "yup";

export default function ResendVerificationPage() {
  const dispatch = useDispatch();
  const [isSending, setIsSending] = useState(false);
  const [hasSent, setHasSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    validationSchema: object().shape({
      email: string()
        .email()
        .required()
    })
  });

  function onSubmit(data) {
    setIsSending(true);
    dispatch(fromApi.resendVerificationLink(data.email))
      .then(() => {
        meToaster.success(
          <div data-testid="verificationLinkResentToaster">
            Email dengan link untuk verifikasi akun telah dikirim ke{" "}
            {data.email}
          </div>
        );
        setHasSent(true);
      })
      .catch(({ statusCode }) => {
        if (statusCode === 404) {
          setError("email", {
            type: "UserDoesNotExist",
            message: "Email ini tidak pernah digunakan untuk signup."
          });
        } else if (statusCode === 409) {
          setError("email", {
            type: "UserAlreadyVerified",
            message: "Akun dengan email ini sudah terverifikasi."
          });
        }
      })
      .finally(() => {
        setIsSending(false);
      });
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="9" lg="7" xl="6">
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <h2>Resend Verification Link</h2>
                <p>
                  Please input your account's email and we will send the
                  verification link back to you.
                </p>
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <CInputGroup className="my-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-user" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      {...register("email")}
                      innerRef={register("email").ref}
                      type="text"
                      placeholder="Your Email"
                      autoComplete="email"
                    />
                  </CInputGroup>
                  {errors.email && (
                    <CAlert color="danger">{errors.email?.message}</CAlert>
                  )}
                  <div className="d-flex justify-content-between">
                    <CButton type="submit" color="primary">
                      {isSending ? (
                        <div class="spinner-border" role="status" />
                      ) : hasSent ? (
                        <CIcon name="cil-check" />
                      ) : (
                        "Send Email"
                      )}
                    </CButton>
                    {hasSent && (
                      <div className="text-right">
                        Please check your inbox in the next 5 minutes.
                        <br />
                        <Link to="/login">Back to Login</Link>
                      </div>
                    )}
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}
