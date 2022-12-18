import React, { lazy } from "react";
import {
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CCallout
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

import { Helmet } from "react-helmet";
import { FaChalkboardTeacher, FaSchool } from "react-icons/fa";
import { IoMdSchool } from "react-icons/io";
import { MdClass, MdVerifiedUser } from "react-icons/md";
import { AiFillCalendar } from "react-icons/ai";
import { useGetAuth, useGetProfile } from "src/hooks/getters.js";
import { Link } from "react-router-dom";
import { CChart } from "@coreui/react-chartjs";
import AttendancePieChart from "./AttendancePieChart.jsx";
import { useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";
import moment from "moment";
import ScheduleModal from "src/components/ScheduleModal.jsx";
import { current } from "@reduxjs/toolkit";

const WidgetsDropdown = lazy(() => import("../widgets/WidgetsDropdown.js"));
const WidgetsBrand = lazy(() => import("../widgets/WidgetsBrand.js"));

const DashboardMenu = props => {
  const { logo, title, path } = props;
  return (
    <Link to={path}>
      <CButton className="p-0 w-100" color="primary" variant="outline">
        <CCard
          className="d-flex align-items-center mb-0 p-4 bg-transparent"
          style={{ boxShadow: "none" }}
        >
          {logo({
            style: { width: "60", height: "auto" },
            className: "mb-3"
          })}
          <h3>{title}</h3>
        </CCard>
      </CButton>
    </Link>
  );
};

const Dashboard = () => {
  const profile = useGetProfile();
  const auth = useGetAuth();

  const baseMenus = [
    {
      logo: FaSchool,
      title: "Sekolah",
      path: "/my-school"
    },
    {
      logo: FaChalkboardTeacher,
      title: "Pengajar",
      path: "/teachers"
    },
    {
      logo: IoMdSchool,
      title: "Pelajar",
      path: "/students"
    },
    {
      logo: MdClass,
      title: "Kelas",
      path: "/classes"
    },
  ];

  const adminMenus = [
    {
      logo: MdVerifiedUser,
      title: "Administrasi",
      path: "/admins"
    }
  ];

  const teacherMenus = [
    {
      logo: AiFillCalendar,
      title: "Jadwal Kelas",
      path: "/my-schedule"
    }
  ]

  const menus = [
    ...baseMenus,
    ...profile.role === "TEACHER" ? teacherMenus : adminMenus
  ]

  console.log(profile);

  useFirestoreConnect([
    ...profile.currentScheduleId ? [{
      collectionGroup: "schedules",
      where: [["id", "==", profile.currentScheduleId]],
      storeAs: "currentSchedules"
    }] : [],
  ]);
  const currentSchedule = useSelector((state) => state.firestore.ordered.currentSchedules?.[0]);
  useFirestoreConnect([
    ...currentSchedule ? [{
      collection: "schools",
      doc: profile.schoolId,
      subcollections: [{
        collection: "classes",
        doc: currentSchedule.classId
      }],
      storeAs: "currentClass"
    }] : [],
  ]);
  const currentClass = useSelector((state) => state.firestore.data.currentClass);
  console.log(currentSchedule, currentClass)
  const isTeacherAndOwnClass = currentSchedule && profile.role === "TEACHER" && current?.teacherIds?.includes(auth.uid);
  const isOwnClassOrAdmin = profile.role !== "TEACHER";

  return (
    <div className="pb-5">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      <CRow>
        <CCol xs={12} sm={6}>
          <h3 className="mb-3">Menu</h3>
          <CRow>
            {menus.map(menu => (
              <CCol md={6} lg={4} className="mb-4">
                <DashboardMenu
                  logo={menu.logo}
                  title={menu.title}
                  path={menu.path}
                />
              </CCol>
            ))}
          </CRow>
        </CCol>
        <CCol xs={12} sm={6}>
          {
            currentSchedule && currentClass && (
              <>
                {/* <ScheduleModal
                  classId={currentSchedule.classId}
                  isOwnClassOrAdmin={true}
                  isTeacherAndOwnClass={true}
                  schedule={currentSchedule}
                  showClassName
                /> */}
                <h3 className="my-3">Sesi Kelas Berlangsung</h3>
                <Link to={`/classes/${currentSchedule.classId}`}>
                  <CCard>
                    <CCardBody>
                      <h5>{currentClass.name}</h5>
                      {moment(currentSchedule.start.toDate()).format("HH:mm")} - {moment(currentSchedule.end.toDate()).format("HH:mm")}
                    </CCardBody>
                  </CCard>
                </Link>
              </>
            )
          }
          <h3 className="my-3">Ringkasan</h3>
          <CRow>
            <CCol xs={12}>
              <AttendancePieChart/>
            </CCol>
          </CRow>
        </CCol>
      </CRow>
    </div>
  );
};

export default Dashboard;
