import { checkEmailAvailability } from "src/utils/checksFunctions";

export function createTeacher(newTeacher) {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();
    const auth = getState().firebase.auth;
    const profile = getState().firebase.profile;

    const emailAvailable = await checkEmailAvailability(firestore, newTeacher.email, profile.schoolId);
    if (!emailAvailable) {
      throw Error("Pengajar dengan email tersebut sudah ada")
    }

    var photoUrl = null;
    if (newTeacher.profileImage) {
      const uploadRes = await firebase.uploadFile(
        "teacherPhotos", 
        newTeacher.profileImage, 
        undefined, 
        { name: `TEACHER-${newTeacher.email}` }
      )
      photoUrl = await uploadRes.uploadTaskSnapshot.ref.getDownloadURL();
      delete newTeacher.profileImage;
    } 
    
    firestore
      .collection("users")
      .add({ 
        ...newTeacher, 
        photoUrl,
        role: "TEACHER",
        classIds: [],
        isVerified: true,
        hasRegistered: false,
        createdBy: auth.uid,
        createdAt: new Date(),
        updatedBy: auth.uid,
        updatedAt: new Date(),
        schoolId: profile.schoolId
      });
  }
}

export function updateTeacher(teacherId, newTeacher) {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();
    const profile = getState().fir

    if (newTeacher.email) {
      const emailAvailable = await checkEmailAvailability(firestore, newTeacher.email, profile.schoolId);
      if (!emailAvailable) {
        throw Error("Pengajar dengan email tersebut sudah ada")
      }
    }
    
    const auth = getState().firebase.auth;
    const teacherRef = firestore
      .collection("users")
      .doc(teacherId);

    var photoUrl = null;
    if (newTeacher.profileImage) {
      const uploadRes = await firebase.uploadFile(
        "teacherPhotos", 
        newTeacher.profileImage, 
        undefined, 
        { name: `TEACHER-${newTeacher.email}` }
      )
      photoUrl = await uploadRes.uploadTaskSnapshot.ref.getDownloadURL();
      delete newTeacher.profileImage;
    } 

    teacherRef.update({ 
      ...newTeacher, 
      ...photoUrl ? { photoUrl } : {},
      updatedBy: auth.uid,
      updatedAt: new Date()
    });
  }
}

export function deleteTeacher(teacherId) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const batch = firestore.batch();
    const { profile } = getState().firebase;

    const teacherRef = firestore.collection("users").doc(teacherId);
    const classesRef = firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("classes");
    const classesQuery = classesRef.where("teacherIds", "array-contains", teacherId);
    const classesSnaps = await classesQuery.get();
    for (const classRef of classesSnaps.docs) {
      batch.update(classRef, {
        teacherIds: firestore.FieldValue.arrayRemove(teacherId)
      });
    }
    await batch.commit();
    await teacherRef.delete();
  }
}

export function signUpAsTeacher(newTeacher) {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    const emailAvailable = await checkEmailAvailability(firestore, newTeacher.email);
    if (!emailAvailable) {
      throw Error("Pengajar dengan email tersebut sudah ada")
    }

    const usersRef = firestore.collection("users");
    const schoolRef = firestore
      .collection("schools")
      .doc(newTeacher.schoolId)

    const school = await schoolRef.get();
    if (!school.exists) {
      throw Error("Sekolah dengan ID tersebut tidak ditemukan")
    } else {
      const existingTeacherSnaps = await usersRef
        .where("email", "==", newTeacher.email)
        .where("role", "==", "TEACHER")
        .get()
        
      var exTeacher = { ...newTeacher };
      var existingTeacher = {};
      var existingTeacherId = null;
      if (!existingTeacherSnaps.empty) {
        existingTeacher = { ...existingTeacherSnaps.docs[0].data() };
        existingTeacherId = existingTeacherSnaps.docs[0].id;
        exTeacher = { ...existingTeacher, ...newTeacher };
        await firestore
          .collection("users")
          .doc(existingTeacherId)
          .delete();
      } 

      const newUser = await firebase.createUser({
        email: newTeacher.email,
        password: newTeacher.password,
      }, {
        ...exTeacher,
        password: null,
        repassword: null,
        role: "TEACHER",
        schoolId: newTeacher.schoolId,
        isVerified: exTeacher.isVerified || false,
        hasRegistered: true,
        createdAt: new Date(),
      })

      const newUserSnaps = await usersRef
        .where("email", "==", newUser.email)
        .where("role", "==", "TEACHER")
        .get();

      await newUserSnaps.docs[0].ref.update({
        createdBy: newUserSnaps.docs[0].id
      });

      if (!existingTeacherSnaps.empty) {
        const classesSnaps = await firestore.collection("schools").doc(newTeacher.schoolId).collection("classes").get();
        if (!classesSnaps.empty) {
          for (const classSnap of classesSnaps.docs) {
            const classData = classSnap.data();
            await classSnap.ref.update({
              teacherIds: classData.teacherIds.filter((tId) => tId !== existingTeacherId).concat(newUserSnaps.docs[0].id)
            })
          }
        }
      }
    }
  }
}