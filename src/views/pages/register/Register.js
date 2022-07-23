import { CButton, CCard, CCardBody, CContainer, CForm, CLabel } from '@coreui/react';
import { async } from '@firebase/util';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { AiOutlineLock, AiOutlineMail, AiOutlineUser } from 'react-icons/ai';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase, useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { useHistory } from 'react-router-dom'
import meColors from 'src/components/meColors';
import meConfirm from 'src/components/meConfirm';
import MENativeSelect from 'src/components/MENativeSelect';
import METextField from 'src/components/METextField';
import meToaster from 'src/components/toaster';
import { ROLE_TYPES, SCHOOL_TYPES } from 'src/enums';
import { signUp } from 'src/store/actions/authActions';
import { object, string } from 'yup';

function RegisterUser(props) {
  const { onSubmit, onBack } = props;
  const adminSchema = object().shape({
    email: string().lowercase().required().strict(),
    fullName: string().required().strict(),
    password: string().required()
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch
  } = useForm({
    resolver: yupResolver(adminSchema)
  })
  const [passwordInputVisibility, setPasswordInputVisibility] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const handlePasswordInputVisibility = () => {
    setPasswordInputVisibility(!passwordInputVisibility);
  };

  const password = watch("password");
  const repassword = watch("repassword");
  useEffect(() => {
    setIsValid(password === repassword);
  }, [password, repassword])

  return (
    <CForm onSubmit={handleSubmit(onSubmit)}>
      <h4>Mohon masukkan informasi otentikasi Anda.</h4>
      <METextField
        { ...register("email") }
        startIcon={AiOutlineMail}
        errors={errors}
      />
      <METextField
        { ...register("fullName") }
        startIcon={AiOutlineUser}
        errors={errors}
      />
      <CLabel htmlFor="password">Password</CLabel>
      <div className="d-flex">
        <METextField
          className="w-100"
          startIcon={AiOutlineLock}
          { ...register("password") }
          errors={errors}
          label={false}
          type={passwordInputVisibility ? "text" : "password"}
        />
        <METextField
          className="w-100 ml-3"
          startIcon={AiOutlineLock}
          placeholder="Confirm Password"
          { ...register("repassword") }
          errors={errors}
          label={false}
          type={passwordInputVisibility ? "text" : "password"}
        />
        <CButton
          className="ml-3"
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
        size="lg"
        className="w-100"
        disabled={!isValid}
      >
        Berikutnya
      </CButton>
    </CForm>
  )
}

function RegisterSchool(props) {
  const { onSubmit, onBack, isSubmitting } = props;
  const schoolSchema = object().shape({
    name: string().required().strict(),
    location: string().required().strict(),
    type: string().required().strict()
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schoolSchema)
  })

  return (
    <CForm onSubmit={handleSubmit(onSubmit)}>
      <METextField
        { ...register("name") }
        placeholder="Enter School Name"
        label="School Name"
        errors={errors}
      />
      <MENativeSelect
        { ...register("type") }
        options={SCHOOL_TYPES}
        placeholder="Enter School Type"
        label="School Type"
        errors={errors}
      />
      <div className="d-flex">
        {
          onBack && (
            <CButton
              color="primary"
              size="lg"
              variant="outline"
              className="mr-3 w-100"
              onClick={onBack}
            >
              Kembali
            </CButton>
          )
        }
        <CButton 
          color="primary"
          size="lg"
          className="w-100"
          type="submit"
          disabled={isSubmitting}
        >
          Daftar
        </CButton>
      </div>
    </CForm>
  )
}

export default function Register() {
  const history = useHistory();
  const dispatch = useDispatch();
  const firebase = useSelector((state) => state.firebase);
  const auth = firebase.auth;
  const authError = firebase.authError;
  const [hasRegistered, setHasRegistered] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleBack() {
    setHasRegistered(false);
  }

  if (auth?.isLoaded && !auth?.isEmpty) {
    history.replace("/");
  }
  
  const firebaseHook = useFirebase();
  const firestore = useFirestore();

  function onSubmitUser(data) {
    console.log(data);
    setUserData(data);
    setHasRegistered(true);
  }

  async function onSubmitSchool(data) {
    meConfirm({
      onConfirm: () => {
        setIsSubmitting(true);
        const schoolsRef = firestore.collection("schools");
        const schoolId = schoolsRef.doc().id;
        schoolsRef.doc(schoolId).set({ ...data })
          .then((sku) => {
            console.log(sku);
            firebaseHook.createUser({
              email: userData.email,
              password: userData.password,
            }, {
              fullName: userData.fullName,
              schoolId,
              role: "ADMIN"
            })
          })
          .catch((e) => {
            meToaster.danger("Error")
          })
          .finally(() => {
            setIsSubmitting(false);
          })
      }
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
          Register
        </title>
      </Helmet>
      <CContainer style={{
        maxWidth: 640
      }}>
        <CCard>
          <CCardBody>
            {
              hasRegistered === false ? (
                <RegisterUser onSubmit={onSubmitUser}/>
              ) : (
                <RegisterSchool onSubmit={onSubmitSchool} onBack={handleBack} isSubmitting={isSubmitting}/>
              )
            }
            {
              hasRegistered === null && (
                <>
                  <RegisterUser onSubmit={onSubmitUser}/>
                  <RegisterSchool onSubmit={onSubmitSchool}/>
                </>
              )
            }
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  )
}
