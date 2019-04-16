import React from 'react';
import Input from "../Input";

const LoginForm = () => {
    return (
        <form>
            <Input name="email" value={"Email"} labelValue="Email" type="text"/>
            <Input name="password" value={"Password"} labelValue="Password" type="password"/>
        </form>
    )
};

export default LoginForm;