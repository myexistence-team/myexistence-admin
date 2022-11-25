export function createStudentPresence({ 
  studentId,
  classId,
  scheduleId,
  studentLogId,
  status
}) {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore();
    const auth = getState().firebase.auth;
    const profile = getState().firebase.profile;

    const studentRef = firestore
      .collection("users")
      .doc(studentId);
    const scheduleRef = firestore
      .collection("schools")
      .doc(profile.schoolId)
      .collection("classes")
      .doc(classId)
      .collection("schedules")
      .doc(scheduleId)
    const studentLogsRef = scheduleRef.collection("studentLogs");

    const scheduleSnap = await scheduleRef.get();
    const schedule = scheduleSnap.data();

    const time = new Date();
    // time.setDate(time.getDate() - 12);

    const newLog = {
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
      status,
      time,
    }

    if (studentLogId) {
      const studentLogRef = studentLogsRef.doc(studentLogId);
      await studentLogRef.update(newLog);
    } else {
      await studentLogsRef.add(newLog);
    }

    await studentRef.update({
      currentScheduleId: scheduleId
    })
  }
}