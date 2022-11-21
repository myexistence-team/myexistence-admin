import classNames from "classnames";
import React from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import MESpinner from "src/components/MESpinner";
import { TheContent, TheFooter, TheHeader, TheSidebar } from "./index";

const TheLayout = () => {
  const history = useHistory();
  const darkMode = useSelector(state => state.coreUi.darkMode);
  const firebase = useSelector(state => state.firebase);
  const profile = firebase.profile;
  const auth = firebase.auth;

  console.log(profile)
  if (profile && !profile.isEmpty && profile.email && (!profile.role || !profile.schoolId)) {
    history.replace("/register-account")
  } else if (profile.email && !profile?.isVerified) {
    history.replace("/not-verified")
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
      <Helmet titleTemplate="%s - Hadir Web App">
        <title>Hadir Web App</title>
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
