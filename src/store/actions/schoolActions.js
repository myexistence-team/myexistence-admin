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

export function createAdminAndTeacher(admin, school) {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();

    console.log("ADMIN", admin);
    console.log("SCHOOL", school);

    const newSchoolRef = firestore.collection("schools");
    const newSchoolId = newSchoolRef.doc().id;

    console.log(newSchoolId)

    await newSchoolRef.doc(newSchoolId).set(school);

    await firebase
      .createUser({
        email: admin.email,
        password: admin.password
      }, {
        ...admin,
        role: "SUPER_ADMIN",
        createdAt: new Date(),
        updatedAt: new Date(),
        schoolId: newSchoolId
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