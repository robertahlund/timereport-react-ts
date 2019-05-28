import React, {Fragment, FunctionComponent, useEffect} from "react";
import ExpenseList from "./ExpenseList";
import {ContentSection} from "../employees/Employees";

const Expenses: FunctionComponent = () => {

  useEffect(() => {
    document.title = "Expenses";
  }, []);

  return (
    <Fragment>
      <ContentSection>
        <ExpenseList/>
      </ContentSection>
    </Fragment>
  );
};

export default Expenses;