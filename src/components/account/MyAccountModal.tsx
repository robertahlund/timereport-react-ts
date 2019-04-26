import React, {ChangeEvent, FunctionComponent, useContext, useState} from "react";
import {AuthContext, AuthContextConsumer, AuthObject} from "../../App";
import styled from "styled-components";
import CloseIcon from "../../Icons/CloseIcon";
import ModalForm from "./ModalForm";
import Button from "../general/Button";
import firebase from "../../firebaseConfig";
import {User} from "firebase";

export const ModalBackground = styled.div`
  height: 100vh;
  width: 100vw;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.39);
  z-index: 1;
`;

export const ModalContent = styled.div`
  border-radius: 3px;
  background-color: #fff;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ModalTitle = styled.h3`
  font-weight: 500;
  margin: 0;
  padding: 25px;
`;

export const Section = styled.div`
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
  setUserInfo: (user: User, displayToast: boolean) => Promise<void>;
}

const MyAccountModal: FunctionComponent<MyAccountModalProps> = props => {
  const authContext = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: typeof authContext === "object" ? authContext.firstName : "",
    lastName: typeof authContext === "object" ? authContext.lastName : "",
    email: typeof authContext === "object" ? authContext.email : "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

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
    try {
      const db = firebase.firestore();
      setLoading(true);
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
            typeof authContext === "object"
          ) {
            await user.updateProfile({
              displayName: `${firstName} ${lastName}`
            });
            await db.collection("users").doc(authContext.uid).update({
              firstName,
              lastName,
              email
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
          if (hasUserEmailChanged(user.email, email) && typeof authContext === "object") {
            await user.updateEmail(email);
            await db.collection('users').doc(authContext.uid).update({
              email
            });
            console.log("Updated email, and email in collection");
          }
        }
        if (showPassword && password != null && password !== "") {
          await user.updatePassword(password);
          console.log("Updated password.");
        }
        await props.setUserInfo(user, false);
        setLoading(false);
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const {firstName, lastName, email, password} = form;

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
                null
              )}
              <CloseIcon
                color="#fff"
                background={true}
                backgroundColor="#fec861"
                onClick={props.toggleModal}
                margin="20px 20px 0 0"
                height="24px"
                width="24px"
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
                loading={loading}
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
