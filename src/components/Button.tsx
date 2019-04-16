import React from 'react';
import styled from "styled-components";

interface ButtonProps {
    type: 'button' | 'submit';
    text: string;
}

const ButtonItem = styled.button`
    align-self: flex-end;
    text-transform: uppercase;
    padding: 10px 50px;
    border: none;
    border-radius: 3px;
    background-color: #FEC861;
    margin-top: 25px;
    color: #393E41;
    cursor: pointer;
`;

const Button = (props: ButtonProps) => {
    return <ButtonItem type={props.type}>{props.text}</ButtonItem>
};

export default Button;