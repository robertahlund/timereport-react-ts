import React, {FunctionComponent, Fragment, useEffect} from "react";
import DetailedRow from "./DetailedRow";
import styled from "styled-components";
import {CardHeader} from "./TimeCard";
import {TimeReportRowSummaryDetail} from "../../types/types";

interface DetailedRowContainerProps {
  rowDetails: TimeReportRowSummaryDetail[];
}

const DetailedRowContainer: FunctionComponent<DetailedRowContainerProps> = props => {

  useEffect(() => {
    props.rowDetails.sort((a, b) => {
      if (a.formattedDate > b.formattedDate) {
        return 1;
      } else if (b.formattedDate > a.formattedDate) {
        return -1;
      }
      return 1;
    })
  }, [props.rowDetails]);

  const {rowDetails} = props;

  return (
    <RowWrapper>
      <CardHeader/>
      {rowDetails.length === 0 ? (
        <DetailedRow
          activityName="No data for this month."
        />
      ) : (
        <Fragment>
          {rowDetails.map(row => (
            <DetailedRow
              hoursWorked={row.hours}
              activityName={row.activityName}
              companyName={row.companyName}
              formattedDate={row.formattedDate}
              key={`${row.formattedDate}-${row.companyName}-${row.activityName}-${row.hours}`}/>
          ))}
        </Fragment>
      )}
    </RowWrapper>
  )
};

export default DetailedRowContainer;

const RowWrapper = styled.div`
  background-color: #F7F7F7;
  margin: 7.5px 7.5px;
  width: 100%;
  border-radius: 3px;
`;