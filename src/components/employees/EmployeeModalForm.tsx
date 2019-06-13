import React, {
  ChangeEvent,
  Fragment,
  FunctionComponent,
  useContext
} from "react";
import Input from "../general/Input";
import { PaddingRow } from "../authentication/LoginForm";
import { Row } from "../authentication/RegisterForm";
import Checkbox from "../general/Checkbox";
import styled from "styled-components";
import Select from "react-select";
import { ValueType } from "react-select/lib/types";
import {
  AuthObject,
  CompanySelectOptions,
  EmployeeFormValue
} from "../../types/types";
import { AuthContext } from "../../context/authentication/authenticationContext";

interface EmployeeModalFormProps {
  form: EmployeeFormValue;
  onFormChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onInactiveChange: (event: ChangeEvent<HTMLInputElement>) => void;
  inactive: boolean;
  selectOptions: CompanySelectOptions[];
  handleSelectChange: (value: ValueType<object>) => void;
}

const EmployeeModalForm: FunctionComponent<EmployeeModalFormProps> = props => {
  const { firstName, lastName, email, uid } = props.form;
  const currentUser: AuthObject | boolean = useContext(AuthContext);
  const { inactive, selectOptions } = props;
  return (
    <Fragment>
      <form autoComplete="off">
        <Row direction="row">
          <Input
            value={firstName.value}
            labelValue="First name"
            type="text"
            name="firstName"
            onFormChange={props.onFormChange}
            width="171px"
            valid={firstName.valid}
            validationMessage={firstName.validationMessage}
          />
          <Input
            value={lastName.value}
            labelValue="Last name"
            type="text"
            name="lastName"
            onFormChange={props.onFormChange}
            width="171px"
            valid={lastName.valid}
            validationMessage={lastName.validationMessage}
          />
        </Row>
        <Row direction="column">
          <PaddingRow>
            <Input
              name="email"
              value={email.value}
              labelValue="Email"
              type="text"
              onFormChange={props.onFormChange}
              width="378px"
              valid={email.valid}
              validationMessage={email.validationMessage}
            />
          </PaddingRow>
          <Checkbox
            onChange={props.onInactiveChange}
            checked={inactive}
            id="inactive-checkbox"
            labelValue="Inactivate user"
            paddingTop="0"
            uid={uid}
            currentUserUid={
              typeof currentUser === "object" ? currentUser.uid : ""
            }
          />
        </Row>
        <Row direction="column">
          <SmallerHeading>Companies</SmallerHeading>
          <Select
            onChange={props.handleSelectChange}
            options={selectOptions}
            placeholder="Select Companies"
            value={null}
            classNamePrefix="react-select"
            className="react-select"
          />
        </Row>
      </form>
    </Fragment>
  );
};

export default EmployeeModalForm;

export const SmallerHeading = styled.h3`
  padding-top: 15px;
`;
