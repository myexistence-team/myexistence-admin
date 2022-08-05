import classNames from "classnames";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import fromApi from "src/actions/fromApi";
import MESpinner from "src/components/MESpinner";
import usePrevious from "src/hooks/usePrevious";
import { TheContent, TheFooter, TheHeader, TheSidebar } from "./index";

const TheLayout = () => {
  const history = useHistory();
  const darkMode = useSelector(state => state.coreUi.darkMode);
  const firebase = useSelector(state => state.firebase);
  const profile = firebase.profile;
  const auth = firebase.auth;

  if (profile?.isLoaded && !profile.schoolId) {
    history.replace("/register-account")
  }
  
  if (auth?.isLoaded && auth?.isEmpty) {
    history.replace("/login");
  }

  const classes = classNames(
    "c-app c-default-layout",
    darkMode && "c-dark-theme"
  );

  return (
    <div className={classes}>
      <Helmet titleTemplate="%s - ME Admin">
        <title>ME Admin</title>
      </Helmet>
      {
        profile && profile.isLoaded ? (
          <>
            <TheSidebar />
            {/* <TheAside /> */}
            <div className="c-wrapper">
              <TheHeader />
              <div className="c-body">
                <TheContent />
              </div>{" "}
              <TheFooter />
            </div>{" "}
          </>
        ) : (
          <MESpinner/>
        )
      }
    </div>
  );
};

export default TheLayout;
