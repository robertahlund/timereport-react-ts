import React, {ChangeEvent, FunctionComponent, useState} from "react";
import Button from "../general/Button";
import {Section, Wrapper} from "./Login";
import RegisterForm from "./RegisterForm";
import firebase from "../../firebaseConfig";
import {AuthObject} from "../../App";

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
  const [loading, setLoading] = useState(false);

  const handleFormChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const formSubmit = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      setLoading(true);
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
          uid,
          email
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
      setLoading(false);
    }
    console.log(firstName, lastName, email, password);
  };

  return (
    <Wrapper>
      <Section>
        <h3>Create new account</h3>
        <RegisterForm onFormChange={handleFormChange} form={form}/>
        <Button
          type="button"
          text="Create"
          loading={loading}
          onSubmit={() =>
            formSubmit(form.firstName, form.lastName, form.email, form.password)
          }
        />
      </Section>
    </Wrapper>
  );
};

export default Register;
