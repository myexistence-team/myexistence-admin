import { checkEmailAvailability } from "src/utils/checksFunctions";

export function createTeacher(newTeacher) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    const profile = getState().firebase.profile;

    const emailAvailable = await checkEmailAvailability(firestore, newTeacher.email);
    if (!emailAvailable) {
      throw Error("Pengajar dengan email tersebut sudah ada")
    }
    
    firestore
      .collection("users")
      .add({ 
        ...newTeacher, 
        role: "TEACHER",
        hasRegistered: false,
        createdBy: auth.uid,
        createdAt: new Date(),
        updatedBy: auth.uid,
        updatedAt: new Date(),
        schoolId: profile.schoolId
      });
  }
}

export function updateTeacher(teacherId, newTeacher) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    
    firestore
      .collection("users")
      .doc(teacherId)
      .update({ 
        ...newTeacher, 
        updatedBy: auth.uid,
        updatedAt: new Date()
      });
  }
}

export function signUpAsTeacher(newTeacher) {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    const schoolRef = firestore
      .collection("schools")
      .doc(newTeacher.schoolId)

    const school = await schoolRef.get();
    if (!school.exists) {
      throw Error("Sekolah dengan ID tersebut tidak ditemukan")
    }

    else {
      const existingTeacher = await firestore
        .collection("users")
        .where("email", "==", newTeacher.email)
        .where("role", "==", "TEACHER")
        .get()

      if (!existingTeacher.empty) {
        const exTeacher = { ...existingTeacher.docs[0].data() };
        await firestore
          .collection("users")
          .doc(existingTeacher.docs[0].id)
          .delete();

        await firebase.createUser({
          email: newTeacher.email,
          password: newTeacher.password,
          signIn: false
        }, {
          ...exTeacher,
          role: "TEACHER",
          schoolId: newTeacher.schoolId,
          hasRegistered: true,
        })
      } 
      else {
        throw Error(`Pengajar dengan email ${newTeacher.email} tidak ditemukan dalam sekolah ID ${newTeacher.schoolId}`);
      }
    }
  }
}