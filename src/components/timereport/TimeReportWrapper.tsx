import React, {Fragment} from 'react';
import {ListHeader} from "../employees/EmployeeList";
import DateSelector from "./DateSelector";


const TimeReportWrapper = () => {
  return (
    <ListHeader>
      <DateSelector/>
    </ListHeader>
  );
};

export default TimeReportWrapper;