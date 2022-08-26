import { checkEmailAvailability } from "src/utils/checksFunctions";

export function createSchool(school) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;

    firestore.collection("schools").add({
      ...school,
      superAdminId: auth.uid,
      superAdmin: firestore.collection("users").doc(auth.uid),
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

    const schoolsRef = firestore.collection("schools");
    const newSchoolId = schoolsRef.doc().id;

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
        schoolId: newSchoolId,
        school: schoolsRef.doc(newSchoolId),
      });
    
    const newlyCreatedUser = await firestore
      .collection("users")
      .where("email", "==", admin.email)
      .get()
    
    await schoolsRef.doc(newSchoolId)
      .set({
        ...school,
        createdBy: newlyCreatedUser.docs[0].id,
        updatedBy: newlyCreatedUser.docs[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    
  }
}

export function editSchool(newSchool) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const schoolId = profile.schoolId;
    const auth = getState().firebase.auth;

    await firestore.collection("schools")
      .doc(schoolId)
      .update({
        ...newSchool,
        updatedAt: new Date(),
        updatedBy: auth.uid,
      });
  }
}