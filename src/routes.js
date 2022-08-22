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
const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));

const routes = pageAccess => [
  { path: "/", exact: true, name: "" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/schools", name: "Sekolah", component: Schools, exact: true },
  { path: "/my-school", name: "Sekolahku", component: MySchool, exact: true },
  { path: "/my-school/edit", name: "Edit Sekolahku", component: SchoolForm, exact: true },
  { path: "/admins", name: "Admin", component: Admins, exact: true },
  { path: "/admins/add", name: "Tambahkan Admin", component: AdminForm, exact: true },
  { path: "/admins/:adminId/edit", name: "Edit Admin", component: AdminForm, exact: true },
  { path: "/teachers", name: "Pengajar", component: Teachers, exact: true },
  { path: "/teachers/add", name: "Tambahkan Pengajar", component: TeacherForm, exact: true },
  { path: "/teachers/:teacherId", name: "Detail Pengajar", component: TeacherDetails, exact: true },
  { path: "/teachers/:teacherId/edit", name: "Edit Pengajar", component: TeacherForm, exact: true },
  { path: "/classes", name: "Kelas", component: Classes, exact: true },
  { path: "/classes/add", name: "Tambahkan Kelas", component: ClassForm, exact: true },
  { path: "/classes/:classId", name: "Detail Kelas", component: ClassDetails, exact: true },
  { path: "/students", name: "Pelajar", component: Students, exact: true },
  { path: "/students/add", name: "Tambahkan Pelajar", component: StudentForm, exact: true },
];

export default routes;
