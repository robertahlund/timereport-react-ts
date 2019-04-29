import React, {FunctionComponent} from 'react';
import CloseIcon from "../../Icons/CloseIcon";
import {ValueType} from "react-select/lib/types";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import {ListContainer, Row} from "../employees/EmployeeModalCompanyList";
import {ActivitySelectOptions} from "./CompanyModal";

interface EmployeeModalCompanyListProps {
  companySelectOptions: ActivitySelectOptions[];
  handleRemoveFromCompanyActivityList: (activity: ValueType<any>) => void;
}

const CompanyModalActivityList: FunctionComponent<EmployeeModalCompanyListProps> = props => {
  const {companySelectOptions} = props;
  return (
    <ListContainer>
      <ReactCSSTransitionGroup
        transitionName="modal-transition"
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}
      >
        {companySelectOptions.map((activity: ActivitySelectOptions) => {
          return (
            <Row key={activity.value}>
              <span>{activity.label}</span>
              <CloseIcon color="#fff" backgroundColor="#FE9161" background={true} margin="0"
                         onClick={() => props.handleRemoveFromCompanyActivityList(activity)}
                         height="16px"
                         width="16px"/>
            </Row>)
        })}
      </ReactCSSTransitionGroup>
    </ListContainer>
  )
};

export default CompanyModalActivityList;