import React, {ChangeEvent, useEffect, useState} from "react";
import { Section, Wrapper } from "./Login";
import ForgotPasswordForm from "./ForgotPasswordForm";
import Button from "../general/Button";
import styled from "styled-components";

const ForgotPassword = () => {
  const [emailInput, setEmailInput] = useState("");

  useEffect(() => {
    document.title = "Forgot Password?"
  }, []);

  const onFormChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmailInput(event.target.value);
  };

  const formSubmit = async (email: string): Promise<void> => {
    console.log(email);
  };

  return (
    <Wrapper>
      <Section>
        <h3>Forgot your password?</h3>
        <Text>
          Enter your email below and a link to reset your password will be sent.
        </Text>
        <ForgotPasswordForm email={emailInput} onEmailChange={onFormChange} />
        <Button
          type="button"
          text="Send"
          onSubmit={() => formSubmit(emailInput)}
        />
      </Section>
    </Wrapper>
  );
};

export default ForgotPassword;

const Text = styled.p`
  display: block;
  max-width: 300px;
  text-align: center;
  margin-top: 0;
  margin-bottom: 25px;
`;