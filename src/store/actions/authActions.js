export const signIn = (credentials) => {
  return async (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    console.log(credentials)

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
      username: newUser.username,
    }, {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      schoolId: profile.schoolId
    })
  }
}