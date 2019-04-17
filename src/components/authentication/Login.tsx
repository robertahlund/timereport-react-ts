import React, {useState} from 'react';
import styled from "styled-components";
import LoginForm from "./LoginForm";
import LoginLinks from "./LoginLinks";
import Button from "../Button";
import firebase from '../../firebaseConfig';

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

const formSubmit = async (email: string, password: string): Promise<void> => {
  await firebase.auth().signInWithEmailAndPassword(email, password);
};

const Login = () => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  return (
    <Wrapper>
      <Section>
        <h3>Login</h3>
        <LoginForm email={emailInput} password={passwordInput} onEmailChange={setEmailInput}
                   onPasswordChange={setPasswordInput}/>
        <LoginLinks/>
        <Button type="button" text="Login" onSubmit={() => formSubmit(emailInput, passwordInput)}/>
      </Section>
    </Wrapper>
  )
};

export default Login;