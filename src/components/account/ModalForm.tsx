import React, {
  FunctionComponent,
  Fragment,
  ChangeEvent
} from "react";
import Input from "../general/Input";
import { PaddingRow } from "../authentication/LoginForm";
import { Row } from "../authentication/RegisterForm";
import styled from "styled-components";
import {RegisterFormValue} from "../../types/types";

interface ModalFormProps {
  form: RegisterFormValue;
  onFormChange: (event: ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  setShowPassword: (showPassword: boolean) => void;
}

const ModalForm: FunctionComponent<ModalFormProps> = props => {
  const { firstName, lastName, email, password } = props.form;
  const { showPassword } = props;
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
          {showPassword ? (
            <Fragment key="1">
              <ShowPasswordText onClick={() => props.setShowPassword(false)}>
                I don't want to change my password
              </ShowPasswordText>
              <Input
                name="password"
                value={password.value}
                labelValue="New password"
                type="password"
                onFormChange={props.onFormChange}
                width="378px"
                valid={password.valid}
                validationMessage={password.validationMessage}
              />
            </Fragment>
          ) : (
            <Fragment key="2">
              <ShowPasswordText onClick={() => props.setShowPassword(true)}>
                I want to change my password
              </ShowPasswordText>
            </Fragment>
          )}
        </Row>
      </form>
    </Fragment>
  );
};

export default ModalForm;

const ShowPasswordText = styled.span`
  font-size: 14px;
  color: #fec861;
  padding-bottom: 10px;
  cursor: pointer;
  display: block;
`;
