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
import { useHistory } from "react-router";
import CIcon from "@coreui/icons-react";
import { signOut } from "src/store/actions/authActions";

const TheHeaderDropdown = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const auth = useSelector(state => state.firebase.auth);
  const profile = useSelector(state => state.firebase.profile);

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
              name={profile.displayName}
              src={profile?.photoUrl}
              size="36"
            />
          </div>
          <span className="text-right">
            <strong>{profile?.username}</strong>
          </span>
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownItem onClick={() => history.push(`/${profile.role === "TEACHER" ? "teachers" : "admins"}/${auth.uid}`)}>
            <CIcon name="cil-user" className="mfe-2" /> Profil
          </CDropdownItem>
          <CDropdownItem divider />
          <CDropdownItem onClick={handleSignOut}>
            <BiLogOut className="mfe-2" />
            Keluar
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </div>
  );
};

export default TheHeaderDropdown;
