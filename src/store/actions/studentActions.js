import { checkEmailAvailability } from "src/utils/checksFunctions";
import { ENROLLMENT_ACTIONS } from "./classActions";

export function createStudent(student) {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();
    const auth = getState().firebase.auth;
    const profile = getState().firebase.profile;

    const emailAvailable = await checkEmailAvailability(firestore, student.email, profile.schoolId);
    if (!emailAvailable) {
      throw Error("Pelajar dengan email tersebut sudah ada")
    }

    var photoUrl = null;
    if (student.profileImage) {
      const uploadRes = await firebase.uploadFile(
        "studentPhotos", 
        student.profileImage, 
        undefined, 
        { name: `STUDENT-${student.email}` }
      )
      photoUrl = await uploadRes.uploadTaskSnapshot.ref.getDownloadURL();
      delete student.profileImage;
    } 

    firestore
    .collection("users")
    .add({ 
      ...student, 
      photoUrl,
      role: "STUDENT",
      isVerified: true,
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
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();
    const auth = getState().firebase.auth;
    const profile = getState().firebase.profile;

    var photoUrl = student.photoUrl;
    if (student.profileImage) {
      const uploadRes = await firebase.uploadFile(
        "studentPhotos", 
        student.profileImage, 
        undefined, 
        { name: `STUDENT-${student.email}` }
      )
      photoUrl = await uploadRes.uploadTaskSnapshot.ref.getDownloadURL();
      delete student.profileImage;
    } 
    
    firestore
      .collection("users")
      .doc(studentId)
      .update({ 
        ...student, 
        ...photoUrl !== undefined ? { photoUrl } : { photoUrl: null },
        updatedBy: auth.uid,
        updatedAt: new Date()
      });
  }
}

export function deleteStudent(studentId) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const batch = firestore.batch();
    const { profile } = getState().firebase;

    const studentRef = firestore.collection("users").doc(studentId);
    const classesRef = firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("classes");
    const classesQuery = classesRef.where("studentIds", "array-contains", studentId);
    const classesSnaps = await classesQuery.get();
    for (const classRef of classesSnaps.docs) {
      batch.update(classRef, {
        studentIds: firestore.FieldValue.arrayRemove(studentId)
      });
    }
    await batch.commit();
    await studentRef.delete();
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