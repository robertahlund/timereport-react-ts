import React, {
  FunctionComponent,
  Fragment,
  ChangeEvent
} from "react";
import Input from "../general/Input";
import {PaddingRow} from "../authentication/LoginForm";
import {Row} from "../authentication/RegisterForm";
import Checkbox from "../general/Checkbox";
import styled from "styled-components";
import Select from "react-select";
import {ValueType} from "react-select/lib/types";
import {CompanySelectOptions} from "./EmployeeModal";

export interface EmployeeForm {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface EmployeeModalFormProps {
  form: EmployeeForm;
  onFormChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onInactiveChange: (event: ChangeEvent<HTMLInputElement>) => void;
  inactive: boolean;
  selectOptions: CompanySelectOptions[];
  handleSelectChange: (value: ValueType<object>) => void;
}

export const SmallerHeading = styled.h3`
  padding-top: 15px;
`;

const EmployeeModalForm: FunctionComponent<EmployeeModalFormProps> = props => {
  const {firstName, lastName, email} = props.form;
  const {inactive, selectOptions} = props;
  return (
    <Fragment>
      <form autoComplete="off">
        <Row direction="row">
          <Input
            value={firstName}
            labelValue="First name"
            type="text"
            name="firstName"
            onFormChange={props.onFormChange}
            width="171px"
          />
          <Input
            value={lastName}
            labelValue="Last name"
            type="text"
            name="lastName"
            onFormChange={props.onFormChange}
            width="171px"
          />
        </Row>
        <Row direction="column">
          <PaddingRow>
            <Input
              name="email"
              value={email}
              labelValue="Email"
              type="text"
              onFormChange={props.onFormChange}
              width="378px"
            />
          </PaddingRow>
          <Checkbox onChange={props.onInactiveChange} checked={inactive} id="inactive-checkbox"
                    labelValue="Inactivate user" paddingTop="0"/>
        </Row>
        <Row direction="column">
          <SmallerHeading>Companies</SmallerHeading>
          <Select onChange={props.handleSelectChange} options={selectOptions} placeholder="Select Companies"
                  value={null} classNamePrefix="react-select" className="react-select"/>
        </Row>
      </form>
    </Fragment>
  );
};

export default EmployeeModalForm;
