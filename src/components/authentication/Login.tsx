import React, { ChangeEvent, useState } from "react";
import styled from "styled-components";
import LoginForm from "./LoginForm";
import LoginLinks from "./LoginLinks";
import Button from "../general/Button";
import firebase from "../../firebaseConfig";

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

export interface LoginFormState {
  email: string;
  password: string;
}

const Login = () => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const formSubmit = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      await firebase.auth().signInWithEmailAndPassword(email, password);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const onLoginFormChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLoginForm({
      ...loginForm,
      [event.target.name]: event.target.value
    });
  };

  return (
    <Wrapper>
      <Section>
        <h3>Login</h3>
        <LoginForm form={loginForm} onFormChange={onLoginFormChange} />
        <LoginLinks />
        <Button
          type="button"
          text="Login"
          onSubmit={() => formSubmit(loginForm.email, loginForm.password)}
          loading={loading}
        />
      </Section>
    </Wrapper>
  );
};

export default Login;
