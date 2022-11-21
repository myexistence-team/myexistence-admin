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
    const batch = firestore.batch();

    const classRef = firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("classes")
      .doc(classId)
    const classSnapshot = await classRef.get();
    const exClass = classSnapshot.data();
    const removedTeacherIds = exClass.teacherIds.filter((tId) => !newClass.teacherIds.includes(tId));

    var teachersRef = [];
    if (newClass.teacherIds.length) {
      teachersRef = await firestore.collection("users").where(firestore.FieldPath.documentId(), "in", newClass.teacherIds).get();
      teachersRef = teachersRef.docs.map((d) => d.ref)
    }
    
    removedTeacherIds.forEach(teacherId => {        
      batch.update(
        firestore
        .collection("users")
        .doc(teacherId), {
          classIds: firestore.FieldValue.arrayRemove(classId),
          classes: firestore.FieldValue.arrayRemove(classRef),
        }
      )
    });
    
    newClass.teacherIds.forEach(teacherId => {        
      batch.update(
        firestore
        .collection("users")
        .doc(teacherId), {
          classIds: firestore.FieldValue.arrayUnion(classId),
          classes: firestore.FieldValue.arrayUnion(classRef),
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
        teachers: teachersRef,
        updatedBy: auth.uid,
        updatedAt: new Date()
      });
  }
}

export function deleteClass(classId) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();

    await firestore
      .collection("users")
      .doc(classId)
      .delete();
  }
}

export function updateClassStudent(action, classId, studentId) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    const profile = getState().firebase.profile;

    const classRef = firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("classes")
      .doc(classId);
    const studentRef = firestore.collection("users").doc(studentId);


    await firestore
      .collection("users")
      .doc(studentId)
      .update({ 
        classIds: action === ENROLLMENT_ACTIONS.ENROLL 
          ? firestore.FieldValue.arrayUnion(classId)
          : firestore.FieldValue.arrayRemove(classId),
        classes: action === ENROLLMENT_ACTIONS.ENROLL 
          ? firestore.FieldValue.arrayUnion(classRef)
          : firestore.FieldValue.arrayRemove(classRef),
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
        students: action === ENROLLMENT_ACTIONS.ENROLL 
          ? firestore.FieldValue.arrayUnion(studentRef) 
          : firestore.FieldValue.arrayRemove(studentRef), 
        updatedBy: auth.uid,
        updatedAt: new Date()
      });
  }
}