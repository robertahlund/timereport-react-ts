import React, {FunctionComponent} from 'react';
import styled from "styled-components";
import CloseIcon from "../../Icons/CloseIcon";
import {ValueType} from "react-select/lib/types";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import {CompanySelectOptions} from "../../types/companyTypes";

interface EmployeeModalCompanyListProps {
  companySelectOptions: CompanySelectOptions[];
  handleRemoveFromEmployeeCompanyList: (company: ValueType<any>) => void;
}

export const ListContainer = styled.div`
  padding-top: 15px;
  width: 100%;
`;

export const Row = styled.div`
  padding: 5px 5px 5px 10px;
  background: #F7F7F7;
  border-radius: 3px;
  font-size: 15px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #f1f1f1;
  &:last-child {
    margin-bottom: 0;
  }
`;

const EmployeeModalCompanyList: FunctionComponent<EmployeeModalCompanyListProps> = props => {
  const {companySelectOptions} = props;
  return (
    <ListContainer>
      <ReactCSSTransitionGroup
        transitionName="modal-transition"
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}
      >
        {companySelectOptions.map((company: CompanySelectOptions) => {
          return (
            <Row key={company.value}>
              <span>{company.label}</span>
              <CloseIcon color="#fff" backgroundColor="#FE9161" background={true} margin="0"
                         onClick={() => props.handleRemoveFromEmployeeCompanyList(company)}
                         height="16px"
                         width="16px"/>
            </Row>)
        })}
      </ReactCSSTransitionGroup>
    </ListContainer>
  )
};

export default EmployeeModalCompanyList;