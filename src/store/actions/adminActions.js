import { checkEmailAvailability } from "src/utils/checksFunctions";

export function createAdmin(admin) {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    const profile = getState().firebase.profile;

    const emailAvailable = await checkEmailAvailability(firestore, admin.email, profile.schoolId);
    if (!emailAvailable) {
      throw Error("Admin dengan email tersebut sudah ada")
    }
    
    firestore
      .collection("users")
      .add({ 
        ...admin, 
        role: "ADMIN",
        isVerified: true,
        hasRegistered: false,
        createdBy: auth.uid,
        createdAt: new Date(),
        updatedBy: auth.uid,
        updatedAt: new Date(),
        schoolId: profile.schoolId,
        school: firestore.collection("schools").doc(profile.schoolId),
      });
  }
}

export function updateAdmin(adminId, newAdmin) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    const profile = getState().firebase.profile;

    const emailAvailable = await checkEmailAvailability(firestore, newAdmin.email, profile.schoolId);
    if (!emailAvailable) {
      throw Error("Admin dengan email tersebut sudah ada")
    }
    
    firestore
      .collection("users")
      .doc(adminId)
      .update({ 
        ...newAdmin, 
        updatedBy: auth.uid,
        updatedAt: new Date(),
        schoolId: profile.schoolId,
        school: firestore.collection("schools").doc(profile.schoolId),
      });
  }
}

export function deleteAdmin(adminId) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();

    await firestore
      .collection("users")
      .doc(adminId)
      .delete();
  }
}

export function signUpAsAdmin(admin) {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    const emailAvailable = await checkEmailAvailability(firestore, admin.email);
    if (!emailAvailable) {
      throw Error("Pengajar dengan email tersebut sudah ada")
    }

    const schoolRef = firestore
      .collection("schools")
      .doc(admin.schoolId)

    const school = await schoolRef.get();
    if (!school.exists) {
      throw Error("Sekolah dengan ID tersebut tidak ditemukan")
    }

    else {
      const existingAdmin = await firestore
        .collection("users")
        .where("email", "==", admin.email)
        .where("role", "==", "ADMIN")
        .get()

      var exAdmin = { ...admin };
      if (!existingAdmin.empty) {
        exAdmin = { ...existingAdmin.docs[0].data(), ...exAdmin };
        await firestore
          .collection("users")
          .doc(existingAdmin.docs[0].id)
          .delete();
      } 

      await firebase.createUser({
        email: admin.email,
        password: admin.password,
        signIn: false,
      }, {
        ...exAdmin,
        school: schoolRef,
        role: "ADMIN",
        schoolId: admin.schoolId,
        isVerified: exAdmin.isVerified || false,
        hasRegistered: true,
        createdAt: new Date(),
      })
    }
  }
}