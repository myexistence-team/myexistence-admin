import React from "react";
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle
} from "@coreui/react";
import Avatar from "react-avatar";
import { useDispatch, useSelector } from "react-redux";
import { BiLogOut } from "react-icons/bi";
import fromApi from "src/actions/fromApi";
import { useHistory } from "react-router";
import CIcon from "@coreui/icons-react";
import { signOut } from "src/store/actions/authActions";

const TheHeaderDropdown = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const selfUser = useSelector(state => state.selfUser);

  async function handleSignOut() {
    await dispatch(signOut());
    await localStorage.clear();
    history.replace("/");
  }

  return (
    <div className="d-flex align-items-center">
      <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
        <CDropdownToggle className="c-header-nav-link" caret={false}>
          <div className="c-avatar mr-3">
            <Avatar
              className="c-avatar-img"
              alt={selfUser?.username}
              name={selfUser?.username}
              size="36"
            />
          </div>
          <span className="text-right">
            <strong>{selfUser?.username}</strong>
          </span>
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          {/* <CDropdownItem header tag="div" color="light" className="text-center">
            <strong>Account</strong>
          </CDropdownItem>
          <CDropdownItem>
            <CIcon name="cil-bell" className="mfe-2" />
            Updates
            <CBadge color="info" className="mfs-auto">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem>
            <CIcon name="cil-envelope-open" className="mfe-2" />
            Messages
            <CBadge color="success" className="mfs-auto">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem>
            <CIcon name="cil-task" className="mfe-2" />
            Tasks
            <CBadge color="danger" className="mfs-auto">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem>
            <CIcon name="cil-comment-square" className="mfe-2" />
            Comments
            <CBadge color="warning" className="mfs-auto">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem header tag="div" color="light" className="text-center">
            <strong>Settings</strong>
          </CDropdownItem>
          <CDropdownItem>
            <CIcon name="cil-user" className="mfe-2" />
            Profile
          </CDropdownItem>
          <CDropdownItem>
            <CIcon name="cil-settings" className="mfe-2" />
            Settings
          </CDropdownItem>
          <CDropdownItem>
            <CIcon name="cil-credit-card" className="mfe-2" />
            Payments
            <CBadge color="secondary" className="mfs-auto">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem>
            <CIcon name="cil-file" className="mfe-2" />
            Projects
            <CBadge color="primary" className="mfs-auto">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem divider /> */}
          <CDropdownItem onClick={() => history.push(`/admins/${selfUser.id}`)}>
            <CIcon name="cil-user" className="mfe-2" /> Profile
          </CDropdownItem>
          <CDropdownItem divider />
          <CDropdownItem onClick={handleSignOut}>
            <BiLogOut className="mfe-2" />
            Logout
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </div>
  );
};

export default TheHeaderDropdown;
