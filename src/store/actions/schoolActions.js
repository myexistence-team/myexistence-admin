import { checkEmailAvailability } from "src/utils/checksFunctions";

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

    const emailAvailable = await checkEmailAvailability(firestore, admin.email);
    if (!emailAvailable) {
      throw Error("Admin dengan email tersebut sudah ada")
    }

    const schoolRef = firestore.collection("schools");
    const newSchoolId = schoolRef.doc().id;

    await schoolRef.doc(newSchoolId).set({
      ...school,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const adminCopy = { ...admin };
    delete adminCopy.password;
    delete adminCopy.repassword;
    await firebase
      .createUser({
        email: admin.email,
        password: admin.password,
        signIn: false
      }, {
        ...adminCopy,
        role: "SUPER_ADMIN",
        createdAt: new Date(),
        updatedAt: new Date(),
        schoolId: newSchoolId
      });
    
    const newlyCreatedUser = await firestore
      .collection("users")
      .where("email", "==", admin.email)
      .get()
    
    await schoolRef.doc(newSchoolId)
      .update({
        createdBy: newlyCreatedUser.docs[0].id,
        updatedBy: newlyCreatedUser.docs[0].id,
      })
    
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