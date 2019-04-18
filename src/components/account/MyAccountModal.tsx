import React, { ChangeEvent, FunctionComponent, useState } from "react";
import { AuthContextConsumer, AuthObject } from "../../App";
import styled from "styled-components";
import CloseIcon from "../../Icons/CloseIcon";
import ModalForm from "./ModalForm";
import Button from "../Button";
import firebase from "../../firebaseConfig";
import {User} from "firebase";

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

const Section = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 3px;
  background: #fff;
  padding: 25px 50px 50px 50px;
  flex-direction: column;
  align-items: center;
  h3 {
    font-weight: 500;
    margin-top: 0;
  }
`;

interface MyAccountModalProps {
  toggleModal: (event: React.MouseEvent) => void;
  context: AuthObject | boolean;
  setUserInfo: (user: User) => Promise<void>;
}

const MyAccountModal: FunctionComponent<MyAccountModalProps> = props => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: typeof props.context === "object" ? props.context.firstName : "",
    lastName: typeof props.context === "object" ? props.context.lastName : "",
    email: typeof props.context === "object" ? props.context.email : "",
    password: ""
  });

  const handleFormChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const hasUserEmailChanged = (
    originalMail: string,
    newMail: string
  ): boolean => {
    return !!(
      originalMail !== newMail &&
      newMail != null &&
      originalMail != null
    );
  };

  const hasUserNameChanged = (
    originalName: string,
    newName: string
  ): boolean => {
    return !!(
      originalName !== newName &&
      newName != null &&
      originalName != null
    );
  };

  const onSubmit = async (
    firstName?: string,
    lastName?: string,
    email?: string,
    password?: string
  ): Promise<void> => {
    console.log(firstName, lastName, email, password);
    console.log(props.context)
    const db = firebase.firestore();
    try {
      const user = await firebase.auth().currentUser;
      console.log(user, `${firstName} ${lastName}`);
      if (user) {
        if (
          user.displayName != null &&
          user.displayName !== "" &&
          firstName !== "" &&
          lastName !== ""
        ) {
          if (
            hasUserNameChanged(user.displayName, `${firstName} ${lastName}`) &&
            typeof props.context === "object"
          ) {
            await user.updateProfile({
              displayName: `${firstName} ${lastName}`
            });
            await db.collection("users").doc(props.context.uid).update({
              firstName,
              lastName
            });
            console.log("Updated profile & collection with displayName.");
          }
        }
        if (
          user.email != null &&
          email !== "" &&
          email != null &&
          email !== ""
        ) {
          if (hasUserEmailChanged(user.email, email)) {
            await user.updateEmail(email);
            console.log("Updated email.");
          }
        }
        if (showPassword && password != null && password !== "") {
          await user.updatePassword(password);
          console.log("Updated password.");
        }
        await props.setUserInfo(user)
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }

    //update user collection
    //update user credentials
    //update password if toggled
  };

  const { firstName, lastName, email, password } = form;

  return (
    <AuthContextConsumer>
      {authContext => (
        <ModalBackground onClick={props.toggleModal}>
          <ModalContent>
            <ModalHeader>
              {typeof authContext === "object" ? (
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
            <Section>
              <ModalForm
                form={form}
                onFormChange={handleFormChange}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
              <Button
                type="button"
                text="Update"
                onSubmit={() => onSubmit(firstName, lastName, email, password)}
              />
            </Section>
          </ModalContent>
        </ModalBackground>
      )}
    </AuthContextConsumer>
  );
};

export default MyAccountModal;
