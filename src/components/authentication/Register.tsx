import React, {useState} from 'react';
import Button from "../Button";
import {Section, Wrapper} from "./Login";
import RegisterForm from "./RegisterForm";
import firebase from '../../firebaseConfig';

const formSubmit = async (firstName: string, lastName: string, email: string, password: string): Promise<void> => {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    console.log(firstName, lastName, email, password);

};

const Register = () => {
    const [firstNameInput, setFirstNameInput] = useState("");
    const [lastNameInput, setLastNameInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    return (
        <Wrapper>
            <Section>
                <h3>Create new account</h3>
                <RegisterForm email={emailInput} password={passwordInput} firstName={firstNameInput}
                              lastName={lastNameInput} onEmailChange={setEmailInput}
                              onFirstNameChange={setFirstNameInput} onLastNameChange={setLastNameInput}
                              onPasswordChange={setPasswordInput}/>
                <Button type="button" text="Create"
                        onSubmit={() => formSubmit(firstNameInput, lastNameInput, emailInput, passwordInput)}/>
            </Section>
        </Wrapper>
    )
};

export default Register;