import React, { FunctionComponent, Fragment } from "react";
import styled from "styled-components";
import { MenuItem } from "./MenuItem";
import Logo from "./Logo";
import { NavLink } from "react-router-dom";

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
  }
`;

interface MenuProps {
  auth: boolean;
}

export const Menu: FunctionComponent<MenuProps> = props => {
  return (
    <Nav>
      <NavLink to="/time" activeClassName="" className="logo">
        <Logo width="100px"/>
      </NavLink>
      {props.auth ? (
        <List>
          <NavLink to="/time" activeClassName="active">
            <MenuItem text="Time" />
          </NavLink>
          <NavLink to="/companies" activeClassName="active">
            <MenuItem text="Companies" />
          </NavLink>
          <NavLink to="/employees" activeClassName="active">
            <MenuItem text="Employees" />
          </NavLink>
          <NavLink to="#" activeClassName="active">
            <MenuItem text="My Account" />
          </NavLink>
          <NavLink to="#" activeClassName="active">
            <MenuItem text="Log out" />
          </NavLink>
        </List>
      ) : null}
    </Nav>
  );
};
