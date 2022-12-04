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
        studentIds: [],
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
    const batch = firestore.batch();

    const classRef = firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("classes")
      .doc(classId)
    const classSnapshot = await classRef.get();
    const exClass = classSnapshot.data();
    const removedTeacherIds = exClass.teacherIds.filter((tId) => !newClass.teacherIds.includes(tId));

    removedTeacherIds.forEach(teacherId => {        
      batch.update(
        firestore
        .collection("users")
        .doc(teacherId), {
          classIds: firestore.FieldValue.arrayRemove(classId),
        }
      )
    });
    
    newClass.teacherIds.forEach(teacherId => {        
      batch.update(
        firestore
        .collection("users")
        .doc(teacherId), {
          classIds: firestore.FieldValue.arrayUnion(classId),
        }
      )
    });

    await batch.commit();
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

export function deleteClass(classId) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const batch = firestore.batch();
    const { profile } = getState().firebase;

    const usersRef = firestore.collection("users");
    const usersQuery = usersRef.where("classIds", "array-contains", classId);
    const classesSnaps = await usersQuery.get();
    for (const classRef of classesSnaps.docs) {
      batch.update(classRef, {
        classIds: firestore.FieldValue.arrayRemove(classId)
      });
    }
    await firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("classes")
      .doc(classId)
      .delete();
  }
}

export function updateClassStudent(action, classId, studentId) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    const profile = getState().firebase.profile;

    await firestore
      .collection("users")
      .doc(studentId)
      .update({ 
        classIds: action === ENROLLMENT_ACTIONS.ENROLL 
          ? firestore.FieldValue.arrayUnion(classId)
          : firestore.FieldValue.arrayRemove(classId),
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
          ? firestore.FieldValue.arrayUnion(studentId) 
          : firestore.FieldValue.arrayRemove(studentId), 
        updatedBy: auth.uid,
        updatedAt: new Date()
      });
  }
}