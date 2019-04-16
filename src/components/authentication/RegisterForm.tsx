import React, {FunctionComponent} from 'react';
import Input from "../Input";

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
    return (
        <form autoComplete="off">
            <Input value={props.firstName} labelValue="First name" type="text" name="first-name" onFormChange={props.onFirstNameChange} width="300px"/>
            <Input value={props.lastName} labelValue="Last name" type="text" name="last-name" onFormChange={props.onLastNameChange} width="300px"/>
            <Input name="email" value={props.email} labelValue="Email" type="text" onFormChange={props.onEmailChange} width="300px"/>
            <Input name="password" value={props.password} labelValue="Password" type="password"
                   onFormChange={props.onPasswordChange} width="300px"/>
        </form>
    )
};

export default RegisterForm;