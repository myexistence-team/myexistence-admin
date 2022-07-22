import buildQueryStr from "../utils/buildQueryStr";
import makeApiRequest, {
  ACTION_TYPES,
  HTTP_METHODS,
  makeApiRequestThunk
} from "./makeApiRequest";
import { makeApiRequestFile } from "./makeApiRequestFile";

class ApiCallActionCreator {
  // AUTH API
  logIn(emailOrUsername, password) {
    return makeApiRequestThunk(
      HTTP_METHODS.POST,
      `/auth/login/admin`,
      {
        username: emailOrUsername,
        password
      },
      ACTION_TYPES.MERGE
    );
  }

  logOut(id) {
    return makeApiRequestThunk(
      HTTP_METHODS.POST,
      `/auth/logout/${id}`,
      null,
      ACTION_TYPES.REPLACE
    );
  }

  getSelfUser() {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      `/auth/selfUser`,
      null,
      ACTION_TYPES.REPLACE
    );
  }

  // ADMIN API
  checkAdminUsername(admin) {
    return makeApiRequestThunk(
      HTTP_METHODS.POST,
      `/admin/checkUsername`,
      admin,
      ACTION_TYPES.MERGE
    );
  }

  createAdmin(admin) {
    return makeApiRequestThunk(
      HTTP_METHODS.POST,
      `/admin`,
      admin,
      ACTION_TYPES.MERGE
    );
  }

  getAdmins(query) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      buildQueryStr(`/admin`, query),
      null,
      ACTION_TYPES.MERGE
    );
  }

  getAdmin(adminId) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      `/admin/${adminId}`,
      null,
      ACTION_TYPES.MERGE
    );
  }

  updateAdmin(adminId, admin) {
    return makeApiRequestThunk(
      HTTP_METHODS.PUT,
      `/admin/${adminId}`,
      admin,
      ACTION_TYPES.MERGE
    );
  }

  // CAMPUS API
  createCampus(campus) {
    return makeApiRequestThunk(
      HTTP_METHODS.POST,
      `/campus`,
      campus,
      ACTION_TYPES.MERGE
    );
  }

  getCampuses(query) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      buildQueryStr(`/campus`, query),
      null,
      ACTION_TYPES.MERGE
    );
  }

  getCampus(campusId) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      `/campus/${campusId}`,
      null,
      ACTION_TYPES.MERGE
    );
  }

  updateCampus(campusId, campus) {
    return makeApiRequestThunk(
      HTTP_METHODS.PUT,
      `/campus/${campusId}`,
      campus,
      ACTION_TYPES.MERGE
    );
  }

  // TEACHER API
  createTeacher(teacher) {
    return makeApiRequestThunk(
      HTTP_METHODS.POST,
      `/teachers`,
      teacher,
      ACTION_TYPES.MERGE
    );
  }

  getTeachers(query) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      buildQueryStr(`/teachers`, query),
      null,
      ACTION_TYPES.MERGE
    );
  }

  getTeacher(teacherId) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      `/teachers/${teacherId}`,
      null,
      ACTION_TYPES.MERGE
    );
  }

  updateTeacher(teacherId, teacher) {
    return makeApiRequestThunk(
      HTTP_METHODS.PUT,
      `/teachers/${teacherId}`,
      teacher,
      ACTION_TYPES.MERGE
    );
  }

  // STUDENT API
  createStudent(student) {
    return makeApiRequestThunk(
      HTTP_METHODS.POST,
      `/students`,
      student,
      ACTION_TYPES.MERGE
    );
  }

  getStudents(query) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      buildQueryStr(`/students`, query),
      null,
      ACTION_TYPES.MERGE
    );
  }

  getStudent(studentId) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      `/students/${studentId}`,
      null,
      ACTION_TYPES.MERGE
    );
  }

  updateStudent(studentId, student) {
    return makeApiRequestThunk(
      HTTP_METHODS.PUT,
      `/students/${studentId}`,
      student,
      ACTION_TYPES.MERGE
    );
  }

  // CLASSROOM API
  createClassroom(classroom) {
    return makeApiRequestThunk(
      HTTP_METHODS.POST,
      `/classrooms`,
      classroom,
      ACTION_TYPES.MERGE
    );
  }

  getClassrooms(query) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      buildQueryStr(`/classrooms`, query),
      null,
      ACTION_TYPES.MERGE
    );
  }

  getClassroom(classroomId) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      `/classrooms/${classroomId}`,
      null,
      ACTION_TYPES.MERGE
    );
  }

  updateClassroom(classroomId, classroom) {
    return makeApiRequestThunk(
      HTTP_METHODS.PUT,
      `/classrooms/${classroomId}`,
      classroom,
      ACTION_TYPES.MERGE
    );
  }

  // SUBJECT API
  createSubject(subject) {
    return makeApiRequestThunk(
      HTTP_METHODS.POST,
      `/subjects`,
      subject,
      ACTION_TYPES.MERGE
    );
  }

  getSubjects(query) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      buildQueryStr(`/subjects`, query),
      null,
      ACTION_TYPES.MERGE
    );
  }

  getSubject(subjectId) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      `/subjects/${subjectId}`,
      null,
      ACTION_TYPES.MERGE
    );
  }

  updateSubject(subjectId, subject) {
    return makeApiRequestThunk(
      HTTP_METHODS.PUT,
      `/subjects/${subjectId}`,
      subject,
      ACTION_TYPES.MERGE
    );
  }

  // CCA API
  createCca(cca) {
    return makeApiRequestThunk(
      HTTP_METHODS.POST,
      `/cca`,
      cca,
      ACTION_TYPES.MERGE
    );
  }

  getCcas(query) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      buildQueryStr(`/cca`, query),
      null,
      ACTION_TYPES.MERGE
    );
  }

  getCca(ccaId) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      `/cca/${ccaId}`,
      null,
      ACTION_TYPES.MERGE
    );
  }

  updateCca(ccaId, cca) {
    return makeApiRequestThunk(
      HTTP_METHODS.PUT,
      `/cca/${ccaId}`,
      cca,
      ACTION_TYPES.MERGE
    );
  }

  // ACADEMIC YEAR API
  createAcademicYear(ay) {
    return makeApiRequestThunk(
      HTTP_METHODS.POST,
      `/academicYears`,
      ay,
      ACTION_TYPES.MERGE
    );
  }

  getAcademicYears() {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      `/academicYears`,
      null,
      ACTION_TYPES.MERGE
    );
  }

  // PARENT API
  createParent(parent) {
    return makeApiRequestThunk(
      HTTP_METHODS.POST,
      `/parents`,
      parent,
      ACTION_TYPES.MERGE
    );
  }

  getParents(query) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      buildQueryStr(`/parents`, query),
      null,
      ACTION_TYPES.MERGE
    );
  }

  getParent(parentId) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      `/parents/${parentId}`,
      null,
      ACTION_TYPES.MERGE
    );
  }

  getParentByIdentificationNumber(parentIdentificationNumber) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      `/parents/idNumber/${parentIdentificationNumber}`,
      null,
      ACTION_TYPES.MERGE
    );
  }

  updateParent(parentId, parent) {
    return makeApiRequestThunk(
      HTTP_METHODS.PUT,
      `/parents/${parentId}`,
      parent,
      ACTION_TYPES.MERGE
    );
  }

  // Programme API
  getProgrammes(query) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      buildQueryStr(`/programmes`, query),
      null,
      ACTION_TYPES.MERGE
    );
  }

  getProgrammesByCampusId(campusId) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      `/programmes/campus/${campusId}`,
      null,
      ACTION_TYPES.MERGE
    );
  }

  getProgramme(programmeId) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      `/programmes/${programmeId}`,
      null,
      ACTION_TYPES.MERGE
    );
  }

  // CLASS YEAR API
  getClassYears(query) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      buildQueryStr(`/classYears`, query),
      null,
      ACTION_TYPES.MERGE
    );
  }

  getClassYear(classYearId) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      `/classYears/${classYearId}`,
      null,
      ACTION_TYPES.MERGE
    );
  }

  createClassYear(classYear) {
    return makeApiRequestThunk(
      HTTP_METHODS.POST,
      `/classYears`,
      classYear,
      ACTION_TYPES.MERGE
    );
  }

  updateClassYear(classYearId, classYear) {
    return makeApiRequestThunk(
      HTTP_METHODS.PUT,
      `/classYears/${classYearId}`,
      classYear,
      ACTION_TYPES.MERGE
    );
  }

  // CCA YEAR API
  createCcaYear(ccaYear) {
    return makeApiRequestThunk(
      HTTP_METHODS.POST,
      `/ccaYears`,
      ccaYear,
      ACTION_TYPES.MERGE
    );
  }

  getCcaYears(query) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      buildQueryStr(`/ccaYears`, query),
      null,
      ACTION_TYPES.MERGE
    );
  }

  getCcaYear(ccaYearId) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      `/ccaYears/${ccaYearId}`,
      null,
      ACTION_TYPES.MERGE
    );
  }

  updateCcaYear(ccaYearId, ccaYear) {
    return makeApiRequestThunk(
      HTTP_METHODS.PUT,
      `/ccaYears/${ccaYearId}`,
      ccaYear,
      ACTION_TYPES.MERGE
    );
  }

  // SUBJECT YEAR API
  createSubjectYear(subjectYear) {
    return makeApiRequestThunk(
      HTTP_METHODS.POST,
      `/subjectYears`,
      subjectYear,
      ACTION_TYPES.MERGE
    );
  }

  getSubjectYears(query) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      buildQueryStr(`/subjectYears`, query),
      null,
      ACTION_TYPES.MERGE
    );
  }

  getSubjectYear(subjectYearId) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      `/subjectYears/${subjectYearId}`,
      null,
      ACTION_TYPES.MERGE
    );
  }

  updateSubjectYear(subjectYearId, subjectYear) {
    return makeApiRequestThunk(
      HTTP_METHODS.PUT,
      `/subjectYears/${subjectYearId}`,
      subjectYear,
      ACTION_TYPES.MERGE
    );
  }

  deleteSubjectYear(subjectYearId) {
    return makeApiRequestThunk(
      HTTP_METHODS.DELETE,
      `/subjectYears/${subjectYearId}`,
      null,
      ACTION_TYPES.MERGE
    );
  }

  // SVE API
  createSve(sve) {
    return makeApiRequestThunk(
      HTTP_METHODS.POST,
      `/sve`,
      sve,
      ACTION_TYPES.MERGE
    );
  }

  getSves(query) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      buildQueryStr(`/sve`, query),
      null,
      ACTION_TYPES.MERGE
    );
  }

  getSve(sveId) {
    return makeApiRequestThunk(
      HTTP_METHODS.GET,
      `/sve/${sveId}`,
      null,
      ACTION_TYPES.MERGE
    );
  }

  updateSve(sveId, sve) {
    return makeApiRequestThunk(
      HTTP_METHODS.PUT,
      `/sve/${sveId}`,
      sve,
      ACTION_TYPES.MERGE
    );
  }
}

const fromApi = new ApiCallActionCreator();

export default fromApi;
