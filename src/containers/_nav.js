import CIcon from "@coreui/icons-react";
import React from "react";
import {
  BiBriefcase,
  BiUser,
  BiGroup,
  BiBarChartSquare,
  BiTargetLock
} from "react-icons/bi";
import { FaChalkboardTeacher, FaListUl, FaSchool, FaUserGraduate } from "react-icons/fa";
import { BsBook } from "react-icons/bs";
import { FiTarget } from "react-icons/fi";
import {
  AiOutlineMessage,
  AiOutlineProject,
  AiOutlineStar
} from "react-icons/ai";
import {
  MdClass,
  MdOutlineCalendarToday,
  MdOutlineFamilyRestroom,
  MdOutlineLocationOn,
  MdOutlineSpaceDashboard,
  MdVerifiedUser
} from "react-icons/md";
import { IoMdSchool } from "react-icons/io"

// Note: need to make sure for all routes name

const baseNavs = [
  {
    _tag: "CSidebarNavItem",
    name: "Dashboard",
    to: "/dashboard",
    icon: <MdOutlineSpaceDashboard className="c-sidebar-nav-icon" />
  },
  {
    _tag: "CSidebarNavItem",
    name: "Sekolahku",
    to: "/my-school",
    icon: <FaSchool className="c-sidebar-nav-icon" />
  },

  {
    _tag: "CSidebarNavItem",
    name: "Pengajar",
    to: "/teachers",
    icon: <FaChalkboardTeacher className="c-sidebar-nav-icon" />
  },
  {
    _tag: "CSidebarNavItem",
    name: "Pelajar",
    to: "/students",
    icon: <IoMdSchool className="c-sidebar-nav-icon" />
  },
  {
    _tag: "CSidebarNavItem",
    name: "Kelas",
    to: "/classes",
    icon: <MdClass className="c-sidebar-nav-icon" />
  },
];

const adminNavs = [
  {
    _tag: "CSidebarNavItem",
    name: "Administrasi",
    to: "/admins",
    icon: <MdVerifiedUser className="c-sidebar-nav-icon" />
  },
]

const _nav = ({ role }) => [
  ...baseNavs,
  ...role === "ADMIN" || role === "SUPER_ADMIN" ? adminNavs : [],
];

export default _nav;
