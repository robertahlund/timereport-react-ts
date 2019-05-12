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
          value={email.value}
          labelValue="Email"
          type="text"
          onFormChange={props.onFormChange}
          width="300px"
          valid={email.valid}
          validationMessage={email.validationMessage}
        />
      </PaddingRow>
      <Input
        name="password"
        value={password.value}
        labelValue="Password"
        type="password"
        onFormChange={props.onFormChange}
        width="300px"
        valid={password.valid}
        validationMessage={password.validationMessage}
      />
    </form>
  );
};

export default LoginForm;

export const PaddingRow = styled.div`
  padding-bottom: 15px;
`;
