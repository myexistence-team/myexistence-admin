export function createSchool(school) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;

    firestore.collection("schools").add({
      ...school,
      adminIds: [
        auth.uid
      ]
    });
  }
}

export function editSchool(newSchool) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const schoolId = profile.schoolId;
    const auth = getState().firebase.auth;

    var existingSchool = await firestore
      .collection("schools")
      .doc(schoolId)
      .get();

    existingSchool = existingSchool.data()

    await firestore.collection("schools")
      .doc(schoolId)
      .set({
        ...existingSchool,
        ...newSchool,
      });
  }
}