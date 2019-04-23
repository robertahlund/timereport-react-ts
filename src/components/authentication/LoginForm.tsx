import React, { ChangeEvent, FunctionComponent } from "react";
import Input from "../general/Input";
import styled from "styled-components";
import { LoginFormState } from "./Login";

interface LoginFormProps {
  form: LoginFormState;
  onFormChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const PaddingRow = styled.div`
  padding-bottom: 15px;
`;

const LoginForm: FunctionComponent<LoginFormProps> = props => {
  const {email, password} = props.form;
  return (
    <form>
      <PaddingRow>
        <Input
          name="email"
          value={email}
          labelValue="Email"
          type="text"
          onFormChange={props.onFormChange}
          width="300px"
        />
      </PaddingRow>
      <Input
        name="password"
        value={password}
        labelValue="Password"
        type="password"
        onFormChange={props.onFormChange}
        width="300px"
      />
    </form>
  );
};

export default LoginForm;
