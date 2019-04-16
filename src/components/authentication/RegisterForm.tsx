import React, {FunctionComponent} from 'react';
import Input from "../Input";
import styled from "styled-components";

interface RegisterFormProps {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onFirstNameChange: (value: string) => void;
    onLastNameChange: (value: string) => void;
}

const RegisterForm: FunctionComponent<RegisterFormProps> = props => {
    const Row = styled.div`
        display: flex;
    `;
    return (
        <form autoComplete="off">
            <Row>
                <Input value={props.firstName} labelValue="First name" type="text" name="first-name"
                       onFormChange={props.onFirstNameChange} width="48%"/>
                <Input value={props.lastName} labelValue="Last name" type="text" name="last-name"
                       onFormChange={props.onLastNameChange} width="48%"/>
            </Row>
            <Row>
                <Input name="email" value={props.email} labelValue="Email" type="text"
                       onFormChange={props.onEmailChange} width="48%"/>
                <Input name="password" value={props.password} labelValue="Password" type="password"
                       onFormChange={props.onPasswordChange} width="48%"/>
            </Row>
        </form>
    )
};

export default RegisterForm;