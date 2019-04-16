import React, {ReactNode} from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import Login from '../authentication/Login';
import Time from "../Time";
import Companies from "../Companies";
import Employees from "../Employees";

interface RouterProps {
    auth: boolean
}

const Routes = (props: RouterProps) => {
    const {auth} = props;
    return (
        <Switch>
            <Route exact path="/" render={(): ReactNode => auth ? <Redirect to="/time"/> : <Redirect to="/login"/>}/>
            <Route exact path="/time" render={(): ReactNode => auth ? <Time/> : <Redirect to="/"/>}/>
            <Route exact path="/companies" render={(): ReactNode => auth ? <Companies/> : <Redirect to="/"/>}/>
            <Route exact path="/employees" render={(): ReactNode => auth ? <Employees/> : <Redirect to="/"/>}/>
            <Route exact path="/login" render={(): ReactNode => auth ? <Redirect to="/"/> : <Login/>}/>
            <Route render={() => <p>TODO: 404</p>}/>
        </Switch>
    )
};

export default Routes;