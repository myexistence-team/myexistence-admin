import { checkEmailAvailability } from "src/utils/checksFunctions";

export function createStudent(student) {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    const profile = getState().firebase.profile;

    const emailAvailable = await checkEmailAvailability(firestore, student.email);
    if (!emailAvailable) {
      throw Error("Pengguna dengan email tersebut sudah ada")
    }

    firestore
    .collection("users")
    .add({ 
      ...student, 
      role: "STUDENT",
      hasRegistered: false,
      createdBy: auth.uid,
      createdAt: new Date(),
      updatedBy: auth.uid,
      updatedAt: new Date(),
      schoolId: profile.schoolId
    });
  }
}

export function updateStudent(studentId, student) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    
    firestore
      .collection("users")
      .doc(studentId)
      .update({ 
        ...student, 
        updatedBy: auth.uid,
        updatedAt: new Date()
      });
  }
}