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

    console.log(studentId);
    console.log(classId);
    console.log(scheduleId);
    console.log(status);

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

    console.log("REF DEFINED")
    
    const scheduleSnap = await scheduleRef.get();
    const schedule = scheduleSnap.data();

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
      time: new Date(),
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