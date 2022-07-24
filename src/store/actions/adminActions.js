export function createAdmin(newAdmin) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    const schoolId = getState().firebase.profile.schoolId;
    
    firestore
      .collection("schools")
      .doc(schoolId)
      .collection("admins")
      .add({ 
        ...newAdmin, 
        createdBy: auth.uid,
        createdAt: new Date(),
        updatedBy: auth.uid,
        updatedAt: new Date()
      });
  }
}

export function updateAdmin(adminId, newAdmin) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    const schoolId = getState().firebase.profile.schoolId;
    
    firestore
      .collection("schools")
      .doc(schoolId)
      .collection("admins")
      .doc(adminId)
      .update({ 
        ...newAdmin, 
        updatedBy: auth.uid,
        updatedAt: new Date()
      });
  }
}