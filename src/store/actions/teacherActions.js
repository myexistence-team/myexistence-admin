export function createTeacher(newTeacher) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    const schoolId = getState().firebase.profile.schoolId;
    
    firestore
      .collection("schools")
      .doc(schoolId)
      .collection("teachers")
      .add({ 
        ...newTeacher, 
        createdBy: auth.uid,
        createdAt: new Date(),
        updatedBy: auth.uid,
        updatedAt: new Date()
      });
  }
}

export function updateTeacher(newTeacher) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    const schoolId = getState().firebase.profile.schoolId;
    
    firestore
      .collection("schools")
      .doc(schoolId)
      .collection("teachers")
      .update({ 
        ...newTeacher, 
        updatedBy: auth.uid,
        updatedAt: new Date()
      });
  }
}