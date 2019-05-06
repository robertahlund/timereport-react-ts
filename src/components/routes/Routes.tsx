import React, { FunctionComponent, ReactNode, useContext } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import Login from "../authentication/Login";
import Time from "../timereport/Time";
import Companies from "../companies/Companies";
import Employees from "../employees/Employees";
import ForgotPassword from "../authentication/ForgotPassword";
import Register from "../authentication/Register";
import Activities from "../activities/Activities";
import {AuthContext} from "../../context/authentication/authenticationContext";

const Routes: FunctionComponent = () => {
  const authContext = useContext(AuthContext);
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={(): ReactNode =>
          authContext ? <Redirect to="/time" /> : <Redirect to="/login" />
        }
      />
      {/*TODO: should point to /time*/}
      <Route
        exact
        path="/time"
        render={(): ReactNode => (authContext ? <Time /> : <Redirect to="/" />)}
      />
      <Route
        exact
        path="/companies"
        render={(): ReactNode =>
          authContext &&
          typeof authContext === "object" &&
          authContext.isAdmin ? (
            <Companies />
          ) : (
            <Redirect to="/" />
          )
        }
      />
        <Route
            exact
            path="/activities"
            render={(): ReactNode =>
                authContext &&
                typeof authContext === "object" &&
                authContext.isAdmin ? (
                    <Activities />
                ) : (
                    <Redirect to="/" />
                )
            }
        />
      <Route
        exact
        path="/employees"
        render={(): ReactNode =>
          authContext &&
          typeof authContext === "object" &&
          authContext.isAdmin ? (
            <Employees />
          ) : (
            <Redirect to="/" />
          )
        }
      />
      <Route
        exact
        path="/login"
        render={(): ReactNode =>
          authContext ? <Redirect to="/" /> : <Login />
        }
      />
      <Route
        exact
        path="/forgot-password"
        render={(): ReactNode =>
          authContext ? <Redirect to="/" /> : <ForgotPassword />
        }
      />
      <Route
        exact
        path="/create-account"
        render={(): ReactNode =>
          authContext ? <Redirect to="/" /> : <Register />
        }
      />
      <Route render={() => <p>TODO: 404</p>} />
    </Switch>
  );
};

export default Routes;
