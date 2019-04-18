import React, { FunctionComponent } from "react";
import { AuthContextConsumer } from "../../App";
import styled from "styled-components";
import CloseIcon from "../../Icons/CloseIcon";
import ModalForm from "./ModalForm";

const ModalBackground = styled.div`
  height: 100vh;
  width: 100vw;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.39);
`;

const ModalContent = styled.div`
  width: 500px;
  height: 400px;
  border-radius: 3px;
  background-color: #fff;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ModalTitle = styled.h3`
  font-weight: 500;
  margin: 0;
  padding: 25px;
`;

interface MyAccountModalProps {
  toggleModal: (event: React.MouseEvent) => void;
}

const MyAccountModal: FunctionComponent<MyAccountModalProps> = props => {
  return (
    <AuthContextConsumer>
      {authContext => (
        <ModalBackground onClick={props.toggleModal}>
          <ModalContent>
            <ModalHeader>
              {typeof authContext !== "boolean" ? (
                <ModalTitle>
                  {authContext.firstName} {authContext.lastName}
                </ModalTitle>
              ) : (
                <ModalTitle>Katten Jansson</ModalTitle>
              )}
              <CloseIcon
                color="#fff"
                background={true}
                backgroundColor="#fec861"
                toggleModal={props.toggleModal}
              />
            </ModalHeader>
            <ModalForm/>
          </ModalContent>
        </ModalBackground>
      )}
    </AuthContextConsumer>
  );
};

export default MyAccountModal;
