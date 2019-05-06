import React, {
  FunctionComponent,
  ChangeEvent,
  useState
} from "react";
import WeekDay from "./WeekDay";
import styled from "styled-components";
import CloseIcon from "../../Icons/CloseIcon";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import {TimeReport} from "../../types/types";

interface WeekRowProps {
  timeReport: TimeReport;
  timeReportIndex: number;
  onTimeReportRowChange: (
    event: ChangeEvent<HTMLInputElement>,
    timeReportIndex?: number,
    timeReportRowIndex?: number
  ) => void;
  deleteRow: (timeReport: TimeReport) => Promise<void>;
  saveSingleRow: (
    timeReportIndex?: number,
    timeReportRowIndex?: number
  ) => Promise<void>;
}

const WeekRow: FunctionComponent<WeekRowProps> = props => {
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);

  const onRowHover = (): void => {
    setShowDeleteIcon(true);
  };

  const { timeReport, timeReportIndex, onTimeReportRowChange } = props;
  return (
    <Row onMouseOver={onRowHover} onMouseLeave={() => setShowDeleteIcon(false)}>
      <TextWrapper>
        <Activity>{timeReport.activityName}</Activity>
        <Company>{timeReport.companyName}</Company>
      </TextWrapper>
      <FieldWrapper>
        {timeReport.timeReportRows.map((timeReportRow, index) => (
          <WeekDay
            timeReportRow={timeReportRow}
            key={index}
            onTimeReportRowChange={onTimeReportRowChange}
            timeReportIndex={timeReportIndex}
            timeReportRowIndex={index}
            saveSingleRow={props.saveSingleRow}
          />
        ))}
        <ReactCSSTransitionGroup
          transitionName="close-button"
          transitionEnterTimeout={0}
          transitionLeaveTimeout={0}
        >
          {showDeleteIcon && (
            <DeleteContainer>
              <CloseIcon
                color="#fff"
                backgroundColor="#FE9161"
                background={true}
                margin="7px"
                onClick={() => props.deleteRow(timeReport)}
                height="16px"
                width="16px"
              />
            </DeleteContainer>
          )}
        </ReactCSSTransitionGroup>
      </FieldWrapper>
    </Row>
  );
};

export default WeekRow;

export const Row = styled.div`
  background-color: #fff;
  padding: 10px 5px 10px 10px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f7f7f7;
  position: relative;
`;

const Activity = styled.span`
  font-weight: 500;
`;

const Company = styled.span`
  font-weight: 300;
`;

export const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 15px;
`;

export const FieldWrapper = styled.div`
  display: flex;
`;

export const DeleteContainer = styled.div`
  position: absolute;
  top: 9px;
  right: -33px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
`;
