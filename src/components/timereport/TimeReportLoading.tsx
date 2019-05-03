import React, {FunctionComponent} from 'react';
import {Row} from "./WeekRow";
import LoadingIcon from "../../Icons/LoadingIcon";

const TimeReportLoading: FunctionComponent = () => {
  return (
    <Row>
      <LoadingIcon
        position="relative"
        left="0"
        height="39px"
        width="39px"
        color="#393e41"
      />
    </Row>
  );
};

export default TimeReportLoading;