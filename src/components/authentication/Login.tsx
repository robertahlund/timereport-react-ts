import React from 'react';
import styled from "styled-components";
import LoginForm from "./LoginForm";
import LoginLinks from "./LoginLinks";
import Button from "../Button";

const Section = styled.div`
    display: flex;
    justify-content: center;
    border-radius: 3px;
    background: #fff;
    padding: 50px;
    flex-direction: column;
    align-items: center;
    h3 {
        font-weight: 500;
        margin-top: 0;
    }
`;

const Wrapper = styled.section`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 85vh;
`;

const Login = () => {
    return (
        <Wrapper>
            <Section>
                <h3>Login</h3>
                <LoginForm/>
                <LoginLinks/>
                <Button type="button" text="Login"/>
            </Section>
        </Wrapper>
    )
};

export default Login;