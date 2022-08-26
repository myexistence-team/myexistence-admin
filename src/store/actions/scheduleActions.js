export function createSchedule(classId, schedule) {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    const profile = getState().firebase.profile;

    const classRef = firestore
    .collection("schools")
    .doc(profile.schoolId)
    .collection("class")
    .doc(classId);

    firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("classes")
      .doc(classId)
      .collection("schedules")
      .add({
        ...schedule,
        class: classRef,
        classId,
        createdBy: auth.uid,
        createdAt: new Date(),
        updatedBy: auth.uid,
        updatedAt: new Date(),
      })
  }
}

export function updateSchedule(classId, scheduleId, schedule) {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    const profile = getState().firebase.profile;

    const classRef = firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("class")
      .doc(classId);

    firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("classes")
      .doc(classId)
      .collection("schedules")
      .doc(scheduleId)
      .update({
        ...schedule,
        class: classRef,
        classId,
        updatedBy: auth.uid,
        updatedAt: new Date(),
      })
  }
}

export function deleteSchedule(classId, scheduleId) {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore();
    const profile = getState().firebase.profile;

    firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("classes")
      .doc(classId)
      .collection("schedules")
      .doc(scheduleId)
      .delete()
  }
}