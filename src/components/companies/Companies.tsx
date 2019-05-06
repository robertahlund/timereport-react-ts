import React, { Fragment, FunctionComponent, useEffect, useState } from "react";
import { ContentSection } from "../employees/Employees";
import CompanyList from "./CompanyList";

const Companies: FunctionComponent = () => {
  useEffect(() => {
    document.title = "Companies";
  }, []);
  return (
    <Fragment>
      <ContentSection>
        <CompanyList/>
      </ContentSection>
    </Fragment>
  );
};

export default Companies;
