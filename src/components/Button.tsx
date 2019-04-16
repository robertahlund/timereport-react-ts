import React, {FunctionComponent} from 'react';
import styled from "styled-components";

const ButtonItem = styled.button`
    align-self: flex-end;
    text-transform: uppercase;
    padding: 10px 50px;
    border: none;
    border-radius: 3px;
    background-color: #FEC861;
    margin-top: 25px;
    font-size: 14px;
    color: #393E41;
    cursor: pointer;
`;

interface ButtonProps {
    type: 'button' | 'submit';
    text: string;
    onSubmit: () => void;
}

const Button: FunctionComponent<ButtonProps> = (props) => {
    return <ButtonItem type={props.type} onClick={props.onSubmit}>{props.text}</ButtonItem>
};

export default Button;