import React, {Fragment, FunctionComponent, useEffect} from "react";
import ExpenseCategoriesList from "./ExpenseCategoriesList";
import {ContentSection} from "../employees/Employees";

const ExpenseCategories: FunctionComponent = () => {

  useEffect(() => {
    document.title = "Expense categories";
  }, []);

  return (
    <Fragment>
      <ContentSection>
        <ExpenseCategoriesList/>
      </ContentSection>
    </Fragment>
  );
};

export default ExpenseCategories;