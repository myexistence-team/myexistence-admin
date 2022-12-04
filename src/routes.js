import React from "react";
import AdminForm from "./views/admins/AdminForm";
import Admins from "./views/admins/Admins";
import MySchool from "./views/schools/MySchool";
import SchoolForm from "./views/schools/SchoolForm";
import Schools from "./views/schools/Schools";
import TeacherForm from "./views/teachers/TeacherForm";
import TeacherDetails from "./views/teachers/TeacherDetails";
import Teachers from "./views/teachers/Teachers";
import Classes from "./views/classes/Classes";
import RegisterAccount from "./views/pages/register/RegisterAccount";
import ClassForm from "./views/classes/ClassForm";
import Students from "./views/students/Students";
import StudentForm from "./views/students/StudentForm";
import ClassDetails from "./views/classes/ClassDetails";
import StudentDetails from "./views/students/StudentDetails";
import MySchedule from "./views/classes/MySchedule";
import StudentExcuses from "./views/studentExcuses/StudentExcuses";
const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));

const adminRoutes = [
  { path: "/my-school/edit", name: "Edit Sekolah", component: SchoolForm, exact: true },
  { path: "/admins", name: "Admin", component: Admins, exact: true },
  { path: "/admins/add", name: "Tambahkan Admin", component: AdminForm, exact: true },
  { path: "/admins/:adminId/edit", name: "Edit Admin", component: AdminForm, exact: true },
  { path: "/teachers/add", name: "Tambahkan Pengajar", component: TeacherForm, exact: true },
  { path: "/classes/add", name: "Tambahkan Kelas", component: ClassForm, exact: true },
  { path: "/students/add", name: "Tambahkan Pelajar", component: StudentForm, exact: true },
  { path: "/students/:studentId/edit", name: "Edit Pelajar", component: StudentForm, exact: true },
  { path: "/student-excuses", name: "Permintaan Izin Pelajar", component: StudentExcuses, exact: true }
];

const teacherRoutes = [
  { path: "/my-schedule", name: "Jadwal", component: MySchedule, exact: true },
]

const routes = ({ role }) => [
  ...role !== "TEACHER" ? adminRoutes : teacherRoutes,
  { path: "/", exact: true, name: "" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/schools", name: "Sekolah", component: Schools, exact: true },
  { path: "/my-school", name: "Sekolah", component: MySchool, exact: true },
  { path: "/teachers", name: "Pengajar", component: Teachers, exact: true },
  { path: "/teachers/:teacherId", name: "Detail Pengajar", component: TeacherDetails, exact: true },
  { path: "/teachers/:teacherId/edit", name: "Edit Pengajar", component: TeacherForm, exact: true },
  { path: "/classes", name: "Kelas", component: Classes, exact: true },
  { path: "/classes/:classId", name: "Detail Kelas", component: ClassDetails, exact: true },
  { path: "/classes/:classId/edit", name: "Edit Kelas", component: ClassForm, exact: true },
  { path: "/students", name: "Pelajar", component: Students, exact: true },
  { path: "/students/:studentId", name: "Detail Pelajar", component: StudentDetails, exact: true },
];

export default routes;
