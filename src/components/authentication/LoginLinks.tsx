import React from 'react';
import {NavLink} from "react-router-dom";
import styled from "styled-components";

const LinkWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 14px;
    padding-top: 10px;
    font-weight: 400;
    a {
        text-decoration: none;
        color: #FEC861;
        display: block;
    }
`;

const LoginLinks = () => {
    return (
        <LinkWrapper>
            <NavLink to="/forgot-password">Forgot your password?</NavLink>
            <NavLink to="/create-account">Create new account</NavLink>
        </LinkWrapper>
    )
};

export default LoginLinks;