import React, { FunctionComponent } from "react";
import styled from "styled-components";
import LoadingIcon from "../../icons/LoadingIcon";

const AuthLoading: FunctionComponent = () => {
  return (
    <LoadingMessageContainer>
      <LoadingIcon height="64px" width="64px" color="#fec861" />
      <LoadingMessage>Logging in...</LoadingMessage>
    </LoadingMessageContainer>
  );
};

export default AuthLoading;

const LoadingMessageContainer = styled.section`
  position: absolute;
  top: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const LoadingMessage = styled.span`
  padding-top: 25px;
`;
