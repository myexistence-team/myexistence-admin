import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import {
  CBreadcrumbRouter,
  CCard,
  CCardBody,
  CContainer,
  CFade
} from "@coreui/react";
import routes from "../routes";
import { useSelector } from "react-redux";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const TheContent = () => {
  const selfUser = useSelector(state => state.selfUser);

  return (
    <main className="c-main">
      <CContainer fluid>
        <CBreadcrumbRouter
          className="border-0 m-0 p-0 pb-3"
          routes={routes()}
        />
        <Suspense fallback={loading}>
          <Switch>
            {routes().map((route, idx) => {
              return (
                route.component && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={props => (
                      <CFade>
                        <route.component {...props} />
                      </CFade>
                    )}
                  />
                )
              );
            })}
            <Redirect from="/" to="/dashboard" />
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  );
};

export default React.memo(TheContent);
