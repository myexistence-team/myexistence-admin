import { getCurrentScheduleTime } from "src/utils/getters";

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

    const newScheduleId = classRef.collection("schedules").doc().id;
    firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("classes")
      .doc(classId)
      .collection("schedules")
      .doc(newScheduleId)
      .set({
        ...schedule,
        id: newScheduleId,
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
        id: scheduleId,
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

export function closeSchedule(classId, scheduleId) {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const batch = firestore.batch();

    const scheduleRef = firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("classes")
      .doc(classId)
      .collection("schedules")
      .doc(scheduleId)
    const qrCodesRef = scheduleRef
      .collection("qrCodes")
    const studentLogsRef = scheduleRef
      .collection("studentLogs")
    const logsRef = firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("logs")

    const qrCodesSnap = await qrCodesRef.get();
    const studentLogsSnap = await studentLogsRef.get();
    qrCodesSnap.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    studentLogsSnap.docs.forEach((doc) => {
      batch.set(logsRef.doc(), doc.data());
      batch.delete(doc.ref);
    });
    await batch.commit();
    await scheduleRef.update({
      status: "CLOSED",
    })
  }
}

export function openSchedule(classId, scheduleId) {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    const profile = getState().firebase.profile;
    const batch = firestore.batch();

    const classRef = firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("classes")
      .doc(classId);
    const classGet = await classRef.get();
    const classObj = classGet.data();

    const scheduleRef = firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("classes")
      .doc(classId)
      .collection("schedules")
      .doc(scheduleId)

    classObj.studentIds.forEach(() => {
      batch.set(
        scheduleRef.collection("qrCodes").doc(), {
          scanned: false
        }
      )
    })

    await batch.commit();
    scheduleRef.update({
        status: "OPENED",
        openedBy: auth.uid,
        openedAt: new Date(),
      })
  }
}