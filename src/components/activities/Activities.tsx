import React, {Fragment, FunctionComponent, useEffect, useState} from "react";
import ActivitiesList from "./ActivitiesList";
import {ContentSection} from "../employees/Employees";

const Activities: FunctionComponent = () => {

  useEffect(() => {
    document.title = "Activities";
  }, []);

  return (
    <Fragment>
      <ContentSection>
        <ActivitiesList/>
      </ContentSection>
    </Fragment>
  );
};

export default Activities;