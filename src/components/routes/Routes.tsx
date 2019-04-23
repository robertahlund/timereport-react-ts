import React, {FunctionComponent, ReactNode} from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import Login from '../authentication/Login';
import Time from "../timereport/Time";
import Companies from "../companies/Companies";
import Employees from "../employees/Employees";
import ForgotPassword from "../authentication/ForgotPassword";
import Register from "../authentication/Register";
import {AuthObject} from "../../App";

interface RouterProps {
  auth: boolean | AuthObject;
}

const Routes: FunctionComponent<RouterProps> = props => {
  const {auth} = props;
  return (
    <Switch>
      <Route exact path="/" render={(): ReactNode => auth ? <Redirect to="/employees"/> : <Redirect to="/login"/>}/>{/*TODO: should point to /time*/}
      <Route exact path="/time" render={(): ReactNode => auth ? <Time/> : <Redirect to="/"/>}/>
      <Route exact path="/companies" render={(): ReactNode => auth ? <Companies/> : <Redirect to="/"/>}/>
      <Route exact path="/employees" render={(): ReactNode => auth ? <Employees/> : <Redirect to="/"/>}/>
      <Route exact path="/login" render={(): ReactNode => auth ? <Redirect to="/"/> : <Login/>}/>
      <Route exact path="/forgot-password" render={(): ReactNode => auth ? <Redirect to="/"/> : <ForgotPassword/>}/>
      <Route exact path="/create-account" render={(): ReactNode => auth ? <Redirect to="/"/> : <Register/>}/>
      <Route render={() => <p>TODO: 404</p>}/>
    </Switch>
  )
};

export default Routes;