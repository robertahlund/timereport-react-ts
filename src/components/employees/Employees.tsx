import React from 'react';
import styled from "styled-components";
import EmployeeList from "./EmployeeList";

const ContentSection = styled.section`
  display: flex;
  flex-direction: column;
  margin: 100px auto 0 auto;
  width: 1024px;
`;

const Employees = () => {
  return (
    <ContentSection>
      <EmployeeList/>
    </ContentSection>);
};

export default Employees;