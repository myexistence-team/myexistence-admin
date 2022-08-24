import CIcon from "@coreui/icons-react";
import {
  CCreateElement,
  CNavItem,
  CProgress,
  CSidebar,
  CSidebarBrand,
  CSidebarMinimizer,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CSidebarNavTitle
} from "@coreui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
// sidebar nav config
import navigation from "./_nav";

const TheSidebar = () => {
  const dispatch = useDispatch();
  const show = useSelector(state => state.coreUi.sidebarShow);
  const profile = useSelector(state => state.firebase.profile);

  return (
    <CSidebar
      show={show}
      unfoldable
      onShowChange={val => dispatch({ type: "coreUi/set", sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none mr-auto w-100" to="/">
        <div className="c-sidebar-brand-full h-100 w-100">
          <div className="hadir-sidebar-brand" />
        </div>
        <div className="c-sidebar-brand-minimized h-100 w-100 px-3">
          <div className="hadir-sidebar-brand-minimized" />
        </div>
      </CSidebarBrand>
      <CSidebarNav>
        <CCreateElement
          items={navigation(profile)}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />

        <CSidebarNavDivider />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
