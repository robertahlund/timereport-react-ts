import React, {FunctionComponent, Fragment, useContext} from "react";
import styled from "styled-components";
import {MenuItem} from "./MenuItem";
import Logo from "../Logo";
import {NavLink} from "react-router-dom";
import firebase from '../../config/firebaseConfig';
import {AuthContext, AuthContextConsumer} from "../../context/authentication/authenticationContext";

interface MenuProps {
  toggleModal: (event: React.MouseEvent) => void;
}

const Menu: FunctionComponent<MenuProps> = props => {

  const signOut = async (): Promise<void> => {
    await firebase.auth().signOut();
  };

  return (
    <AuthContextConsumer>
      {authContext => (
        <Nav>
          <NavLink to="/time" activeClassName="" className="logo">
            <Logo width="100px"/>
          </NavLink>
          {authContext !== false ? (
            <List>
              <NavLink to="/time" activeClassName="active">
                <MenuItem text="Time"/>
              </NavLink>
              {typeof authContext === 'object' && authContext.isAdmin ? (
                <Fragment>
                  <NavLink to="/activities" activeClassName="active">
                    <MenuItem text="Activities"/>
                  </NavLink>
                  <NavLink to="/companies" activeClassName="active">
                    <MenuItem text="Companies"/>
                  </NavLink>
                  <NavLink to="/employees" activeClassName="active">
                    <MenuItem text="Employees"/>
                  </NavLink>
                </Fragment>) : null}
              <NavLink to="#" activeClassName="active">
                <MenuItem text="My Account" toggleModal={props.toggleModal}/>
              </NavLink>
              <NavLink to="#" activeClassName="active">
                <MenuItem text="Log out" signOut={signOut}/>
              </NavLink>
            </List>
          ) : null}
        </Nav>
      )}
    </AuthContextConsumer>
  );
};

export default Menu;

const List = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
`;

const Nav = styled.nav`
  background-color: #fec861;
  display: flex;
  justify-content: space-between;
  padding: 30px 75px;
  color: #393e41;
  a {
    text-decoration: none;
    color: #393e41;
    padding: 0 30px;
    text-transform: uppercase;
    font-weight: 300;
    letter-spacing: 0.5px;
  }
  a.logo {
    padding-left: 0;
  }
  a:last-child {
    padding-right: 0;
  }
  a.active {
    background: #fff;
    padding-top: 7px;
    padding-bottom: 7px;
    border-radius: 3px;
    transition: background-color .3s;
  }
`;