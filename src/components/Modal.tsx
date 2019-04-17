import React, {FunctionComponent} from 'react';
import {AuthContextConsumer} from "../App";
import styled from "styled-components";
import CloseIcon from "../Icons/CloseIcon";

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

const ModalContent = styled.div`
  width: 500px;
  height: 400px;
  border-radius: 3px;
  background-color: #fff;
`;

const Modal: FunctionComponent<ModalProps> = props => {
  return (
    <AuthContextConsumer>
      {authContext => (
        <ModalBackground>
          <ModalContent>
            <CloseIcon color="#fff"/>
            {typeof authContext !== 'boolean' ? <p>{authContext.firstName} {authContext.lastName}</p> : null}
          </ModalContent>
        </ModalBackground>
      )}
    </AuthContextConsumer>
  );
};

export default Modal;