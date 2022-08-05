export const signIn = (credentials) => {
  return async (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    await firebase.login({
      email: credentials.email,
      password: credentials.password
    })
  }
}

export const signOut = () => {
  return async (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    await firebase.logout();
  }
}

export const signUp = (newUser) => {
  return async (dispatch, getState, {getFirebase}) => {
    const firebase = getFirebase();
    const profile = getState().firebase.profile;

    firebase.createUser({
      email: newUser.email, 
      password: newUser.password,
      signIn: false
    }, {
      displayName: newUser.displayName,
      role: newUser.role,
      schoolId: profile.schoolId
    })
  }
}

export const signUpForAccount = (data) => {
  return async (dispatch, getState, {getFirebase, getFirestore}) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;

    const usersRef = firestore.collection("users");
    const oldUsersRef = usersRef
      .where("email", "==", auth.email)
      .where("schoolId", "==", data.schoolId)
    const oldUsers = await oldUsersRef.get()

    if (oldUsers.empty) {
      throw Error("Anda tidak terdaftar di sekolah yang Anda pilih!")
    }

    const oldUser = { ...oldUsers.docs[0].data() }
    await usersRef.doc(oldUsers.docs[0].id).delete();

    const newUser = {
      ...oldUser,
      schoolId: data.schoolId,
      createdBy: auth.uid,
      createdAt: new Date(),
      updatedBy: auth.uid,
      updatedAt: new Date(),
    }

    await usersRef.doc(auth.uid).set(newUser);
  }
}