import React, {FunctionComponent} from 'react';
import Input from "../Input";

interface LoginFormProps {
    email: string;
    password: string;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
}

const LoginForm: FunctionComponent<LoginFormProps> = props => {
    return (
        <form>
            <Input name="email" value={props.email} labelValue="Email" type="text" onFormChange={props.onEmailChange} width="300px"/>
            <Input name="password" value={props.password} labelValue="Password" type="password"
                   onFormChange={props.onPasswordChange} width="300px"/>
        </form>
    )
};

export default LoginForm;