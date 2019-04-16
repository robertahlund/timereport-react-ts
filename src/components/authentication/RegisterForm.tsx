import React, { FunctionComponent } from "react";
import Input from "../Input";
import styled from "styled-components";
import { PaddingRow } from "./LoginForm";

interface RegisterFormProps {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
}

interface RowProps {
  direction: string;
}

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

const RegisterForm: FunctionComponent<RegisterFormProps> = props => {
  return (
    <form autoComplete="off">
      <Row direction="row">
        <Input
          value={props.firstName}
          labelValue="First name"
          type="text"
          name="first-name"
          onFormChange={props.onFirstNameChange}
          width="171px"
        />
        <Input
          value={props.lastName}
          labelValue="Last name"
          type="text"
          name="last-name"
          onFormChange={props.onLastNameChange}
          width="171px"
        />
      </Row>
      <Row direction="column">
        <PaddingRow>
          <Input
            name="email"
            value={props.email}
            labelValue="Email"
            type="text"
            onFormChange={props.onEmailChange}
            width="378px"
          />
        </PaddingRow>
        <Input
          name="password"
          value={props.password}
          labelValue="Password"
          type="password"
          onFormChange={props.onPasswordChange}
          width="378px"
        />
      </Row>
    </form>
  );
};

export default RegisterForm;
