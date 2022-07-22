import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CImg,
  CRow
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import meColors from "src/components/meColors";
// import logAnalyticsEvent from "src/utils/logAnalyticsEvent";
import { object, string } from "yup";
// import loginImg from "src/images/login.png";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn } from "src/store/actions/authActions";
import METextField from "src/components/METextField";
import { AiOutlineLock, AiOutlineUser } from "react-icons/ai";
import { isLoaded, useFirebase, useFirebaseConnect } from "react-redux-firebase";

const Login = () => {
  useFirebaseConnect(["auth"]);
  const history = useHistory();
  const dispatch = useDispatch();
  const firebase = useSelector(state => state.firebase);
  const auth = firebase.auth;
  console.log(isLoaded(auth))
  const [passwordInputVisibility, setPasswordInputVisibility] = useState(false);

  const formSchema = object().shape({
    email: string().lowercase().required().strict(),
    password: string().required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    resolver: yupResolver(formSchema)
  });

  const authError = firebase.authError;
  useEffect(() => {
    if (authError) {
      setError("email", () => {
        switch(authError.code) {
          case "auth/wrong-password":
            return {
              type: "conflict",
              message: "Password Anda Salah"
            };
          default:
            return {
              type: "conflict",
              message: "Terjadi kesalahan saat login"
            };
        }
      });
    }
  }, [authError])

  if (auth?.isLoaded && !auth?.isEmpty) {
    history.replace("/");
  }

  const handlePasswordInputVisibility = () => {
    setPasswordInputVisibility(!passwordInputVisibility);
  };

  const firebaseHook = useFirebase();
  const onSubmit = data => {
    firebaseHook.login({
      email: data.email,
      password: data.password
    })
    // dispatch(
    //   signIn({
    //     email: data.email,
    //     password: data.password
    //   })
    // ).catch((e) => {
    //   console.log("WAAAA",  e);
    // })
    // logAnalyticsEvent("enter login info", {}, null);
  };

  return (
    <div
      className="c-app c-default-layout flex-row align-items-center"
      style={{
        background: meColors.primary.main
      }}
    >
      <Helmet>
        <title>Login</title>
      </Helmet>
      <CContainer>
        <CCardGroup>
          <CCard className="p-4">
            <CCardBody>
              <CRow>
                <CCol sm={12} md={6}>
                  <CImg
                    // src={loginImg}
                    className="w-75 mx-auto d-block"
                    align="center"
                  />
                </CCol>
                <CCol sm={12} md={6}>
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="text-center mb-4">Login</h1>
                    <METextField
                      { ...register("email") }
                      startIcon={AiOutlineUser}
                      errors={errors}
                      autoComplete="username"
                    />
                    <div className="d-flex">
                      <METextField
                        { ...register("password") }
                        startIcon={AiOutlineLock}
                        errors={errors}
                        className="w-100"
                        autoComplete="current-password"
                        type={passwordInputVisibility ? "text" : "password"}
                      />
                      <CButton
                        className="ml-3 mt-4"
                        style={{
                          height: "fit-content"
                        }}
                        onClick={handlePasswordInputVisibility}
                      >
                        {passwordInputVisibility ? (
                          <MdVisibilityOff />
                        ) : (
                          <MdVisibility />
                        )}
                      </CButton>
                    </div>

                    <CButton
                      type="submit"
                      color="primary"
                      className="px-4 w-100 mb-3"
                      size="lg"
                      disabled={!isLoaded(auth)}
                    >
                      Login
                    </CButton>
                    <span>Tidak punya akun? <Link to="/register">Daftar disini!</Link></span>
                  </CForm>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCardGroup>
      </CContainer>
    </div>
  );
};

export default Login;
