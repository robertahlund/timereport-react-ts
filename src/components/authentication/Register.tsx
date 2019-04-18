import React, { ChangeEvent, FunctionComponent, useState } from "react";
import Button from "../Button";
import { Section, Wrapper } from "./Login";
import RegisterForm from "./RegisterForm";
import firebase from "../../firebaseConfig";
import { AuthObject } from "../../App";

const formSubmit = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<void> => {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = await firebase.auth().currentUser;
    let uid;
    if (user) {
      await user.updateProfile({
        displayName: `${firstName} ${lastName}`
      });
      uid = user.uid;
      const userDocument: AuthObject = {
        firstName,
        lastName,
        uid
      };
      const db = firebase.firestore();
      await db
        .collection("users")
        .doc(uid)
        .set(userDocument);
      console.log("Account created");
    }
  } catch (error) {
    console.log(error);
  }
  console.log(firstName, lastName, email, password);
};

export interface RegisterFormState {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

const Register: FunctionComponent = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const handleFormChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  return (
    <Wrapper>
      <Section>
        <h3>Create new account</h3>
        <RegisterForm onFormChange={handleFormChange} form={form} />
        <Button
          type="button"
          text="Create"
          onSubmit={() =>
            formSubmit(form.firstName, form.lastName, form.email, form.password)
          }
        />
      </Section>
    </Wrapper>
  );
};

export default Register;
