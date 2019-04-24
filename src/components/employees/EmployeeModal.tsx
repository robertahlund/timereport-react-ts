import React, {ChangeEvent, FunctionComponent, useState, Fragment, useEffect} from "react";
import {AuthObject} from "../../App";
import styled from "styled-components";
import CloseIcon from "../../Icons/CloseIcon";
import Button from "../general/Button";
import firebase from "../../firebaseConfig";
import EmployeeModalForm from "./EmployeeModalForm";
import LoadingIcon from "../../Icons/LoadingIcon";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

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
  z-index: 1;
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

interface EmployeeModalProps {
  toggleModal: (event: React.MouseEvent) => void;
  uid: string;
}

const EmployeeModal: FunctionComponent<EmployeeModalProps> = props => {
  const [userInactive, setUserInactive] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState();

  const getUserInformation = async (): Promise<void> => {
    const db = firebase.firestore();
    await db.collection('users')
      .doc(props.uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          setSelectedUser(doc.data());
          setForm({
            firstName: doc.data()!.firstName ? doc.data()!.firstName : "",
            lastName: doc.data()!.lastName,
            email: doc.data()!.email
          });
          setUserInactive(doc.data()!.inactive);
          setModalLoading(false);
          return doc.data();
        } else return null;
      });
  };

  useEffect(() => {
    console.log('effect');
    getUserInformation();
  }, []);

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
    inactive?: boolean
  ): Promise<void> => {
    console.log(firstName, lastName, email, inactive);
    try {
      const db = firebase.firestore();
      setLoading(true);
      const user: AuthObject | null | undefined = await db.collection('users')
        .doc(props.uid)
        .get()
        .then(doc => {
          if (doc.exists) {
            return doc.data();
          } else return null;
        });
      if (user) {
        if (
          user.firstName != null && user.firstName !== "" &&
          user.lastName !== "" && user.lastName !== "" &&
          firstName !== "" &&
          lastName !== ""
        ) {
          if (
            hasUserNameChanged(`${user.firstName} ${user.lastName}`, `${firstName} ${lastName}`) ||
            user.inactive !== inactive
          ) {
            await db.collection("users").doc(props.uid).update({
              firstName,
              lastName,
              email,
              inactive
            });
            console.log("Updated collection with name & inactive status.");
          }
        }
        if (
          user.email != null &&
          email !== "" &&
          email != null &&
          email !== ""
        ) {
          if (hasUserEmailChanged(user.email, email)) {
            await db.collection('users').doc(props.uid).update({
              email
            });
            console.log("Updated email in collection");
          }
        }
        getUserInformation();
        setLoading(false);
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const {firstName, lastName, email} = form;

  return (
    <ModalBackground onClick={props.toggleModal}>
      {modalLoading ? (
        <LoadingIcon position="relative" left="0px" height="100px" width="100px" color="#393e41"/>
      ) : (
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {typeof selectedUser === 'object' ? (
                <Fragment>{selectedUser.firstName} {selectedUser.lastName}</Fragment>) : null}
            </ModalTitle>
            <CloseIcon
              color="#fff"
              background={true}
              backgroundColor="#fec861"
              toggleModal={props.toggleModal}
            />
          </ModalHeader>
          <Section>
            <EmployeeModalForm
              form={form}
              onFormChange={handleFormChange}
              onInactiveChange={(event: ChangeEvent<HTMLInputElement>) => setUserInactive(event.target.checked)}
              inactive={userInactive}
            />
            <Button
              type="button"
              text="Update"
              loading={loading}
              onSubmit={() => onSubmit(firstName, lastName, email, userInactive)}
            />
          </Section>
        </ModalContent>
      )}
    </ModalBackground>
  );
};

export default EmployeeModal;
