import { checkEmailAvailability } from "src/utils/checksFunctions";
import { ENROLLMENT_ACTIONS } from "./classActions";

export function createStudent(student) {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    const profile = getState().firebase.profile;

    const emailAvailable = await checkEmailAvailability(firestore, student.email, profile.schoolId);
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

export function updateStudentClass(action, studentId, classId) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;

    const studentRef = await firestore
      .collection("users")
      .doc(studentId)
      .get()
    const prevStudent = studentRef.data();
    console.log(prevStudent);

    firestore
      .collection("users")
      .doc(studentId)
      .update({ 
        classIds: action === ENROLLMENT_ACTIONS.ENROLL 
          ? [...prevStudent.classIds || [], classId]
          : [...prevStudent.classIds].filter((cId) => cId !== classId), 
        updatedBy: auth.uid,
        updatedAt: new Date()
      });
  }
}