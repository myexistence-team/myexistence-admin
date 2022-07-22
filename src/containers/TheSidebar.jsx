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
  const selfUser = useSelector(state => state.selfUser);

  return (
    <CSidebar
      show={show}
      unfoldable
      onShowChange={val => dispatch({ type: "coreUi/set", sidebarShow: val })}
    >
      <CSidebarNav>
        <CCreateElement
          items={navigation()}
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
