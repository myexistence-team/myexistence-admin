import React from "react";
import AdminForm from "./views/admins/AdminForm";
import Admins from "./views/admins/Admins";
import MySchool from "./views/schools/MySchool";
import SchoolForm from "./views/schools/SchoolForm";
import Schools from "./views/schools/Schools";
import TeacherForm from "./views/teachers/TeacherForm";
import TeacherDetails from "./views/teachers/TeacherDetails";
import Teachers from "./views/teachers/Teachers";
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
];

export default routes;
