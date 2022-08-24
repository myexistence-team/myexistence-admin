export async function checkEmailAvailability(firestore, email, schoolId) {
  let existingUsers;
  if (schoolId) {
    existingUsers = await firestore
      .collection("users")
      .where("email", "==", email)
      .where("schoolId", "==", schoolId)
      .get()
  } else {
    existingUsers = await firestore
      .collection("users")
      .where("email", "==", email)
      .get()
  }

  return (existingUsers.empty)
}

export async function checkSchoolExistance(firestore, schoolId) {
  const existingSchool = await firestore
    .collection("schools")
    .doc(schoolId)
    .get()

  return (existingSchool.exists)
}

export const checkSchoolExistanceThunk = (schoolId) => {
  return async (dispatch, getState, {getFirebase, getFirestore}) => {
    const firestore = getFirestore();
    const existingSchool = await firestore
      .collection("schools")
      .doc(schoolId)
      .get()

    if (!existingSchool.exists) {
      throw Error("Sekolah dengan ID tersebut tidak ditemukan!")
    }
    return (existingSchool.exists)
  }
}