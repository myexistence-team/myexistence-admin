export const ENROLLMENT_ACTIONS = {
  ENROLL: "ENROLL",
  UNENROLL: "UNENROLL",
}

export function createClass(newClass) {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    const profile = getState().firebase.profile;

    firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("classes")
      .add({ 
        ...newClass, 
        createdBy: auth.uid,
        createdAt: new Date(),
        updatedBy: auth.uid,
        updatedAt: new Date(),
      });
  }
}

export function updateClass(classId, newClass) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    const profile = getState().firebase.profile;

    firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("classes")
      .doc(classId)
      .update({ 
        ...newClass, 
        updatedBy: auth.uid,
        updatedAt: new Date()
      });
  }
}

export function updateClassStudent(action, classId, studentId) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    const profile = getState().firebase.profile;

    const classRef = await firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("classes")
      .doc(classId)
      .get()
    const prevClass = classRef.data();

    const studentRef = await firestore
      .collection("users")
      .doc(studentId)
      .get()
    const prevStudent = studentRef.data();

    await firestore
      .collection("users")
      .doc(studentId)
      .update({ 
        classIds: action === ENROLLMENT_ACTIONS.ENROLL 
          ? [...prevStudent?.classIds || [], classId]
          : [...prevStudent?.classIds].filter((cId) => cId !== classId), 
        updatedBy: auth.uid,
        updatedAt: new Date()
      });
    
    firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("classes")
      .doc(classId)
      .update({ 
        studentIds: action === ENROLLMENT_ACTIONS.ENROLL 
          ? [...prevClass?.studentIds || [], studentId] 
          : [...prevClass?.studentIds].filter((sId) => sId !== studentId), 
        updatedBy: auth.uid,
        updatedAt: new Date()
      });
  }
}