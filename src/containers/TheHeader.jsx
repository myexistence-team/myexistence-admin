import CIcon from "@coreui/icons-react";
import { CHeader, CHeaderNav, CSidebarBrand, CToggler } from "@coreui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { TheHeaderDropdown } from "./index";
import TheHeaderDropdownMssg from "./TheHeaderDropdownMssg";

const TheHeader = () => {
  const dispatch = useDispatch();
  const asideShow = useSelector(state => state.coreUi.asideShow);
  const darkMode = useSelector(state => state.coreUi.darkMode);
  const sidebarShow = useSelector(state => state.coreUi.sidebarShow);

  const toggleSidebar = () => {
    const val = [true, "responsive"].includes(sidebarShow)
      ? false
      : "responsive";
    dispatch({ type: "coreUi/set", sidebarShow: val });
  };

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow)
      ? true
      : "responsive";
    dispatch({ type: "coreUi/set", sidebarShow: val });
  };

  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CSidebarBrand
        className="d-md-down-none mr-auto w-100"
        style={{
          flex: "0 0 160px"
        }}
        to="/"
      >
        <div className="c-sidebar-brand-full h-100 w-100">
          <div className="me-sidebar-brand" />
        </div>
        <div className="c-sidebar-brand-minimized h-100 w-100 px-3">
          <div className="me-sidebar-brand-minimized" />
        </div>
      </CSidebarBrand>

      <CHeaderNav className="px-3">
        <CToggler
          inHeader
          className="ml-3 d-md-down-none c-d-legacy-none"
          onClick={() => dispatch({ type: "coreUi/set", darkMode: !darkMode })}
          title="Toggle Light/Dark Mode"
        >
          <CIcon
            name="cil-moon"
            className="c-d-dark-none"
            alt="CoreUI Icons Moon"
          />
          <CIcon
            name="cil-sun"
            className="c-d-default-none"
            alt="CoreUI Icons Sun"
          />
        </CToggler>
        {/* <TheHeaderDropdownNotif />
        <TheHeaderDropdownTasks /> */}
        <TheHeaderDropdownMssg />
        <TheHeaderDropdown />
        {/* <CToggler
          inHeader
          className="d-md-down-none"
          onClick={() =>
            dispatch({ type: "coreUi/set", asideShow: !asideShow })
          }
        >
          <CIcon className="mr-2" size="lg" name="cil-applications-settings" />
        </CToggler> */}
      </CHeaderNav>

      {/* <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter
        className="border-0 c-subheader-nav m-0 px-0 px-md-3"
        routes={routes}
        />
        <div className="d-md-down-none mfe-2 c-subheader-nav">
        <CLink className="c-subheader-nav-link" href="#">
        <CIcon name="cil-speech" alt="Settings" />
        </CLink>
        <CLink
        className="c-subheader-nav-link"
        aria-current="page"
        to="/dashboard"
        >
        <CIcon name="cil-graph" alt="Dashboard" />
        &nbsp;Dashboard
        </CLink>
        <CLink className="c-subheader-nav-link" href="#">
        <CIcon name="cil-settings" alt="Settings" />
        &nbsp;Settings
        </CLink>
        </div>
      </CSubheader> */}
    </CHeader>
  );
};

export default TheHeader;
