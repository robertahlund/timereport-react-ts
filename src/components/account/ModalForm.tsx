import React, {
  FunctionComponent,
  Fragment,
  ChangeEvent
} from "react";
import Input from "../general/Input";
import { PaddingRow } from "../authentication/LoginForm";
import { Row } from "../authentication/RegisterForm";
import { RegisterFormState } from "../authentication/Register";
import styled from "styled-components";

const ShowPasswordText = styled.span`
  font-size: 14px;
  color: #fec861;
  padding-bottom: 10px;
  cursor: pointer;
  display: block;
`;

interface ModalFormProps {
  form: RegisterFormState;
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
          {showPassword ? (
            <Fragment key="1">
              <ShowPasswordText onClick={() => props.setShowPassword(false)}>
                I don't want to change my password
              </ShowPasswordText>
              <Input
                name="password"
                value={password}
                labelValue="New password"
                type="password"
                onFormChange={props.onFormChange}
                width="378px"
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
