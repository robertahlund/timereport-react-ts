import React, { useState, Fragment, FunctionComponent, useEffect } from "react";
import styled from "styled-components";
import EmployeeList from "./EmployeeList";
import EmployeeModal from "./EmployeeModal";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

const Employees: FunctionComponent = () => {
  useEffect(() => {
    document.title = "Employees";
  }, []);
  return (
    <Fragment>
      <ContentSection>
        <EmployeeList/>
      </ContentSection>

    </Fragment>
  );
};

export default Employees;

export const ContentSection = styled.section`
  display: flex;
  flex-direction: column;
  margin: 100px auto 0 auto;
  width: 70vw;
  max-width: 1440px;
`;

