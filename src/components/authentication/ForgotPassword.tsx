import React, { ChangeEvent, useState } from "react";
import { Section, Wrapper } from "./Login";
import ForgotPasswordForm from "./ForgotPasswordForm";
import Button from "../Button";
import styled from "styled-components";

const Text = styled.p`
  display: block;
  max-width: 300px;
  text-align: center;
  margin-top: 0;
  margin-bottom: 25px;
`;

const formSubmit = (email: string): void => {
  console.log(email);
};

const ForgotPassword = () => {
  const [emailInput, setEmailInput] = useState("");

  const onFormChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmailInput(event.target.value);
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
