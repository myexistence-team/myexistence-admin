import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import KKSpinner from "./components/MESpinner";
import "./scss/style.scss";
import "react-markdown-editor-lite/lib/index.css";
import RegisterAccount from "./views/pages/register/RegisterAccount";
import NotVerified from "./views/pages/NotVerified";

const loading = (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ width: "100vw", height: "100vh" }}
  >
    <div>
      <h3 className="mb-3 text-center text-primary">
        Hadir
        <br />
        <strong>Web App</strong>
      </h3>
      <KKSpinner />
    </div>
  </div>
);

// Containers
const TheLayout = React.lazy(() => import("./containers/TheLayout"));

// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Register = React.lazy(() => import("./views/pages/register/Register"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Suspense fallback={loading}>
          <Switch>
            {/* <Route
              exact
              path="/verify"
              name="Verification Page"
              render={props => <VerificationPage {...props} />}
            />
            <Route
              exact
              path="/verify/resend"
              name="Resend Verification Link Page"
              render={props => <ResendVerificationPage {...props} />}
            /> */}
            <Route
              exact
              path="/login"
              name="Login Page"
              render={props => <Login {...props} />}
            />
            <Route
              exact
              path="/register"
              name="Register Page"
              render={props => <Register {...props} />}
            />
            <Route
              exact
              path="/register-account"
              name="Register Account"
              render={props => <RegisterAccount {...props} />}
            />
            <Route
              exact
              path="/not-verified"
              name="Belum Terverifikasi"
              render={props => <NotVerified {...props} />}
            />
            <Route
              exact
              path="/404"
              name="Page 404"
              render={props => <Page404 {...props} />}
            />
            <Route
              exact
              path="/500"
              name="Page 500"
              render={props => <Page500 {...props} />}
            />
            <Route
              path="/"
              name="Home"
              render={props => <TheLayout {...props} />}
            />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    );
  }
}

export default App;
