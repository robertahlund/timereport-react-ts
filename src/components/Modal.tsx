import React, {FunctionComponent} from 'react';
import {AuthContextConsumer} from "../App";
import styled from "styled-components";

interface ModalProps {

}

const ModalBackground = styled.div`
  height: 100vh;
  width: 100vw;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, .39);
`;

const Modal: FunctionComponent<ModalProps> = props => {
  return (
    <AuthContextConsumer>
      {authContext => (
        <ModalBackground>
          {typeof authContext !== 'boolean' ? <p>{authContext.firstName} {authContext.lastName}</p> : null}
        </ModalBackground>
      )}
    </AuthContextConsumer>
  );
};

export default Modal;