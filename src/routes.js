import React from "react";
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
];

export default routes;
