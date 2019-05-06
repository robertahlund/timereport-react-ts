import React, { ChangeEvent, FunctionComponent } from "react";
import Input from "../general/Input";
import styled from "styled-components";
import {LoginFormValue} from "../../types/types";

interface LoginFormProps {
  form: LoginFormValue;
  onFormChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

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

export const PaddingRow = styled.div`
  padding-bottom: 15px;
`;
