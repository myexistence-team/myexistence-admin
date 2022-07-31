import { checkEmailAvailability } from "src/utils/checkEmail";

export function createAdmin(admin) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    const profile = getState().firebase.profile;

    const emailAvailable = await checkEmailAvailability(firestore, admin.email);
    if (!emailAvailable) {
      throw Error("Admin dengan email tersebut sudah ada")
    }
    
    firestore
      .collection("users")
      .add({ 
        ...admin, 
        role: "ADMIN",
        hasRegistered: false,
        createdBy: auth.uid,
        createdAt: new Date(),
        updatedBy: auth.uid,
        updatedAt: new Date(),
        schoolId: profile.schoolId
      });
  }
}

export function updateAdmin(adminId, newAdmin) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    
    firestore
      .collection("users")
      .doc(adminId)
      .update({ 
        ...newAdmin, 
        updatedBy: auth.uid,
        updatedAt: new Date()
      });
  }
}

export function signUpAsAdmin(newAdmin) {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    const schoolRef = firestore
      .collection("schools")
      .doc(newAdmin.schoolId)

    const school = await schoolRef.get();
    if (!school.exists) {
      throw Error("Sekolah dengan ID tersebut tidak ditemukan")
    }

    else {
      const existingAdmin = await firestore
        .collection("users")
        .where("email", "==", newAdmin.email)
        .where("role", "==", "ADMIN")
        .get()

      if (!existingAdmin.empty) {
        const exAdmin = { ...existingAdmin.docs[0].data() };
        await firestore
          .collection("users")
          .doc(existingAdmin.docs[0].id)
          .delete();

        await firebase.createUser({
          email: newAdmin.email,
          password: newAdmin.password,
        }, {
          ...exAdmin,
          role: "ADMIN",
          schoolId: newAdmin.schoolId,
          hasRegistered: true,
        })
      } 
      else {
        throw Error(`Admin dengan email ${newAdmin.email} tidak ditemukan dalam sekolah ID ${newAdmin.schoolId}`);
      }
    }
  }
}