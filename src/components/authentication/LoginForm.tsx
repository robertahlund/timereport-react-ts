import React, { FunctionComponent } from "react";
import Input from "../Input";
import styled from "styled-components";

interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

export const PaddingRow = styled.div`
  padding-bottom: 15px;
`;

const LoginForm: FunctionComponent<LoginFormProps> = props => {
  return (
    <form>
      <PaddingRow>
        <Input
          name="email"
          value={props.email}
          labelValue="Email"
          type="text"
          onFormChange={props.onEmailChange}
          width="300px"
        />
      </PaddingRow>
      <Input
        name="password"
        value={props.password}
        labelValue="Password"
        type="password"
        onFormChange={props.onPasswordChange}
        width="300px"
      />
    </form>
  );
};

export default LoginForm;
