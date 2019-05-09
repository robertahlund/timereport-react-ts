import React, {FunctionComponent} from 'react';
import CloseIcon from "../../icons/CloseIcon";
import {ValueType} from "react-select/lib/types";
import {ListContainer, Row} from "../employees/EmployeeModalCompanyList";
import {ActivitySelectOptions} from "../../types/types";

interface EmployeeModalCompanyListProps {
  companySelectOptions: ActivitySelectOptions[];
  handleRemoveFromCompanyActivityList: (activity: ValueType<any>) => void;
}

const CompanyModalActivityList: FunctionComponent<EmployeeModalCompanyListProps> = props => {
  const {companySelectOptions} = props;
  return (
    <ListContainer>
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
    </ListContainer>
  )
};

export default CompanyModalActivityList;