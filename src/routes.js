import React from "react";
import AdminForm from "./views/admins/AdminForm";
import Admins from "./views/admins/Admins";
import MySchool from "./views/schools/MySchool";
import Schools from "./views/schools/Schools";
const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));

const routes = pageAccess => [
  { path: "/", exact: true, name: "" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/schools", name: "Schools", component: Schools, exact: true },
  { path: "/my-school", name: "My School", component: MySchool, exact: true },
  { path: "/admins", name: "Admins", component: Admins, exact: true },
  { path: "/admins/add", name: "Tambahkan Admin", component: AdminForm, exact: true },
];

export default routes;
