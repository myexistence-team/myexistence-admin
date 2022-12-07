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
    const auth = getState().firebase.auth;
    const batch = firestore.batch();

    const userRef = firestore
      .collection("users")
      .doc(auth.uid);
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
    const classRef = firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("classes")
      .doc(classId)

    const qrCodesSnap = await qrCodesRef.get();
    const studentLogsSnap = await studentLogsRef.get();
    const classSnap = await classRef.get();

    qrCodesSnap.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    const presentStudentIds = [];
    const classStudentIds = classSnap.data().studentIds;

    studentLogsSnap.docs.forEach((doc) => {
      presentStudentIds.push(doc.data().studentId);
      batch.set(logsRef.doc(), doc.data());
      batch.delete(doc.ref);
    });

    const absentStudentIds = classStudentIds.filter((sId) => !presentStudentIds.includes(sId));

    if (absentStudentIds.length) {
      const scheduleSnap = await scheduleRef.get();
      const schedule = scheduleSnap.data();
      absentStudentIds.forEach((studentId) => {
        batch.set(
          logsRef.doc(), {
            schedule: {
              start: schedule.start,
              end: schedule.end,
              tolerance: schedule.tolerance,
              openedAt: schedule.openedAt,
            },
            scheduleId: scheduleSnap.id,
            studentId,
            classId,
            teacherId: schedule.openedBy,
            status: "ABSENT",
            time: new Date()
          }
        )
      })
    }
    await batch.commit();
    await userRef.update({
      currentScheduleId: null
    });
    await scheduleRef.update({
      status: "CLOSED",
    })
  }
}

export function openSchedule({ classId, scheduleId, location = null, openMethod }) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    const profile = getState().firebase.profile;
    const batch = firestore.batch();

    const userRef = firestore
      .collection("users")
      .doc(auth.uid)
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
    await userRef.update({
      currentScheduleId: scheduleId
    })
    await scheduleRef.update({
      status: "OPENED",
      openedBy: auth.uid,
      openedAt: new Date(),
      openMethod: openMethod,
      location
    })
  }
}

export function changeExcuseStatus({ classId, scheduleId, studentLogId, excuseStatus }) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const { profile, auth } = getState().firebase;

    const studentLogRef = firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("classes")
      .doc(classId)
      .collection("schedules")
      .doc(scheduleId)
      .collection("studentLogs")
      .doc(studentLogId);

    await studentLogRef.update({
      excuseStatus,
      updatedBy: auth.uid,
      updatedAt: new Date()
    });
  }
}

export function changeLogStatus({ classId, scheduleId, studentLogId, status }) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const { profile, auth } = getState().firebase;

    const studentLogRef = firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("classes")
      .doc(classId)
      .collection("schedules")
      .doc(scheduleId)
      .collection("studentLogs")
      .doc(studentLogId);

    await studentLogRef.update({
      status,
      updatedBy: auth.uid,
      updatedAt: new Date()
    });
  }
}

export function changeSchoolLogExcuseStatus({ logId, excuseStatus }) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const { profile, auth } = getState().firebase;

    const logRef = firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("logs")
      .doc(logId);

    await logRef.update({
      excuseStatus,
      excuseStatusUpdatedBy: auth.uid,
      excuseStatusUpdatedAt: new Date()
    });
  }
}

export function changeSchoolLogStatus({ logId, status }) {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const { profile, auth } = getState().firebase;

    const logRef = firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("logs")
      .doc(logId);

    await logRef.update({
      status,
      updatedBy: auth.uid,
      updatedAt: new Date()
    });
  }
}