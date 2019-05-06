import React, { ChangeEvent, FunctionComponent } from "react";
import Input from "../general/Input";
import styled from "styled-components";
import { PaddingRow } from "./LoginForm";
import Checkbox from "../general/Checkbox";
import {RegisterFormValue} from "../../types/types";

interface RegisterFormProps {
  onFormChange: (event: ChangeEvent<HTMLInputElement>) => void;
  form: RegisterFormValue;
  onCheckboxChange: (event: ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
}

interface RowProps {
  direction: string;
}

const RegisterForm: FunctionComponent<RegisterFormProps> = props => {
  const { firstName, lastName, email, password } = props.form;
  const {checked} = props;
  return (
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
        <Input
          name="password"
          value={password}
          labelValue="Password"
          type="password"
          onFormChange={props.onFormChange}
          width="378px"
        />
      </Row>
      <Row direction="column">
        <Checkbox onChange={props.onCheckboxChange} checked={checked} id="admin-checkbox" labelValue="Create admin account" paddingTop="15px"/>
      </Row>
    </form>
  );
};

export default RegisterForm;

export const Row = styled.div`
  display: flex;
  width: 400px;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: ${(props: RowProps) => props.direction};
  &:first-child {
    padding-bottom: 15px;
  }
`;