import { CButton, CCard, CCardBody, CContainer, CForm, CLabel } from '@coreui/react';
import { async } from '@firebase/util';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { AiOutlineLock, AiOutlineMail, AiOutlineUser } from 'react-icons/ai';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { Link, useHistory } from 'react-router-dom'
import meColors from 'src/components/meColors';
import meConfirm from 'src/components/meConfirm';
import MEFirestoreSelect from 'src/components/MEFirestoreSelect';
import MENativeSelect from 'src/components/MENativeSelect';
import METextArea from 'src/components/METextArea';
import METextField from 'src/components/METextField';
import meToaster from 'src/components/toaster';
import { SCHOOL_TYPES } from 'src/enums';
import { signUpAsAdmin } from 'src/store/actions/adminActions';
import { createAdminAndTeacher } from 'src/store/actions/schoolActions';
import { signUpAsTeacher } from 'src/store/actions/teacherActions';
import { checkSchoolExistance } from 'src/utils/checksFunctions';
import { object, string } from 'yup';

function RegisterAdmin(props) {
  const { onSubmit, onBack, isSubmitting, adminOnly } = props;
  const adminSchema = object().shape({
    email: string().lowercase().required().strict(),
    displayName: string().required().strict(),
    password: string().required(),
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
      <h5>Sebagai Admin</h5>
      <METextField
        { ...register("email") }
        startIcon={AiOutlineMail}
        errors={errors}
      />
      <METextField
        { ...register("displayName") }
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
          disabled={!isValid || isSubmitting}
        >
          Daftar
        </CButton>
      </div>
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
  } = useForm({
    resolver: yupResolver(schoolSchema)
  })

  return (
    <CForm onSubmit={handleSubmit(onSubmit)}>
      <METextField
        { ...register("name") }
        placeholder="Masukkan Nama Sekolah"
        label="Nama Sekolah"
        errors={errors}
      />
      <MENativeSelect
        { ...register("type") }
        options={SCHOOL_TYPES}
        placeholder="Pilih Tipe Sekolah"
        label="Tipe Sekolah"
        errors={errors}
      />
      <METextArea
        { ...register("location") }
        placeholder="Masukkan Lokasi Sekolah"
        label="Lokasi Sekolah"
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

function RegisterTeacher(props) {
  const { onSubmit, onBack, isSubmitting } = props;
  const teacherSchema = object().shape({
    displayName: string().required().strict(),
    email: string().required().strict(),
    password: string().required().strict(),
  })
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(teacherSchema)
  })

  return (
    <CForm onSubmit={handleSubmit(onSubmit)}>
      <h5>Sebagai Pengajar</h5>
      <METextField
        label="Nama"
        { ...register("displayName") }
        errors={errors}
      />
      <METextField
        { ...register("email") }
        errors={errors}
      />
      <METextField
        { ...register("password") }
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
  const firestoreHook = useFirestore();
  const auth = firebase.auth;
  const authError = firebase.authError;
  const [type, setType] = useState(null);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [isCheckingSchool, setIsCheckingSchool] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, formState: { errors }, watch, getValues } = useForm();

  function handleBack() {
    setHasRegistered(false);
    setType(null);
  }

  function handleBackFromSchool() {
    setHasRegistered(false);
  }

  if (auth?.isLoaded && !auth?.isEmpty) {
    history.replace("/");
  }

  function onSubmitUser(data) {
    meConfirm({
      onConfirm: () => {
        setIsSubmitting(true);
        dispatch(signUpAsAdmin({ ...data,schoolId: getValues("schoolId") }))
          .catch((e) => {
            meToaster.warning(e.message);
          })
          .finally(() => {
            setIsSubmitting(false);
          })
      }
    })
  }

  function onSubmitAdmin(data) {
    setAdminData({ ...data, schoolId: getValues("schoolId") });
    setHasRegistered(true);
  }

  function onSubmitSchool(data) {
    meConfirm({
      onConfirm: () => {
        setIsSubmitting(true);
        dispatch(createAdminAndTeacher(adminData, data))
          .catch((e) => {
            meToaster.warning(e.message);
          })
          .finally(() => {
            setIsSubmitting(false);
          })
      }
    })
  }

  function handleTypeChange(type) {
    setIsCheckingSchool(true);
    checkSchoolExistance(firestoreHook, getValues("schoolId"))
      .then((exists) => {
        if (exists) {
          setType(type);
        } else {
          meToaster.warning("Sekolah dengan ID tersebut tidak ditemukan");
        }
      })
      .finally(() => {
        setIsCheckingSchool(false)
      })
  }

  function onSubmitTeacher(data) {
    const payload = {
      ...data,
      schoolId: getValues("schoolId")
    }
    meConfirm({
      onConfirm: () => {
        setIsSubmitting(true);
        dispatch(signUpAsTeacher(payload))
          .catch((e) => {
            meToaster.warning(e.message);
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
            <h4 className="mb-3">Daftar Akun Baru</h4>
            {
              type === null ? (
                <>
                  <MEFirestoreSelect
                    control={control}
                    name="schoolId"
                    listName="schools"
                    label={false}
                    labelKey="name"
                    placeholder="Cari Sekolah"
                  />
                  <div className="text-center">
                    <div 
                      className="d-flex justify-content-center my-3"
                      style={{
                        gap: 16
                      }}
                    >
                      <CButton
                        color="primary"
                        variant="outline"
                        className="w-100"
                        onClick={() => handleTypeChange("TEACHER")}
                        disabled={!watch("schoolId") || isCheckingSchool}
                      >
                        Daftar sebagai Pengajar
                      </CButton>
                      <CButton
                        color="primary"
                        variant="outline"
                        className="w-100"
                        onClick={() => handleTypeChange("ADMIN")}
                        disabled={!watch("schoolId") || isCheckingSchool}
                      >
                        Daftar sebagai Administrator
                      </CButton>
                    </div>
                    atau
                    <br/>

                    <CButton
                      color="primary"
                      size="lg"
                      className="mt-3 mb-4"
                      onClick={() => setType("SCHOOL")}
                    >
                      Daftarkan sekolah baru
                    </CButton>
                    <br/>
                    Sudah punya akun? <Link to="/login">Masuk</Link>
                  </div>
                </>
              ) : type === "ADMIN" ? (
                <RegisterAdmin onBack={handleBack} onSubmit={onSubmitUser}/>
              ) : type === "TEACHER" ? (
                <RegisterTeacher onBack={handleBack} onSubmit={onSubmitTeacher}/>
              ) : hasRegistered ? (
                <RegisterSchool onBack={handleBackFromSchool} onSubmit={onSubmitSchool}/>
              ) : (
                <RegisterAdmin onBack={handleBack} onSubmit={onSubmitAdmin}/>
              )
            }
            
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  )
}
