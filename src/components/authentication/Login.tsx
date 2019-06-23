import React, {ChangeEvent, FunctionComponent, useEffect, useState} from "react";
import styled from "styled-components";
import LoginForm from "./LoginForm";
import LoginLinks from "./LoginLinks";
import Button from "../general/Button";
import firebase from "../../config/firebaseConfig";
import {toast} from "react-toastify";
import {initialLoginFormState} from "../../constants/employeeConstants";
import {validateLoginForm} from "../../utilities/validations/validateLoginForm";
import {LoginFormValue} from "../../types/types";

const Login: FunctionComponent = () => {
  const [loginForm, setLoginForm] = useState<LoginFormValue>(initialLoginFormState);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    document.title = "Login"
  }, []);

  const formSubmit = async (): Promise<void> => {
    const validatedForm: LoginFormValue = {...validateLoginForm(loginForm)};
    if (!validatedForm.valid) {
      console.log(validatedForm);
      setLoginForm(validatedForm);
      return;
    }
    const password: string = loginForm.password.value;
    const email: string = loginForm.email.value;
    try {
      setLoading(true);
      await firebase.auth().signInWithEmailAndPassword(email, password);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
      console.log(error);
    }
  };

  const onLoginFormChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLoginForm({
      ...loginForm,
      [event.target.name]: {
        valid: true,
        validationMessage: "",
        value: event.target.value
      }
    });
  };

  return (
    <Wrapper>
      <Section>
        <h3>Login</h3>
        <LoginForm form={loginForm} onFormChange={onLoginFormChange}/>
        <LoginLinks/>
        <Button
          type="button"
          text="Login"
          onSubmit={formSubmit}
          loading={loading}
        />
      </Section>
    </Wrapper>
  );
};

export default Login;

export const Section = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 3px;
  background: #fff;
  padding: 50px;
  flex-direction: column;
  align-items: center;
  h3 {
    font-weight: 500;
    margin-top: 0;
  }
`;

export const Wrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 85vh;
`;
