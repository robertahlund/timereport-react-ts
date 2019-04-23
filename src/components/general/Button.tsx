import React, {FunctionComponent} from 'react';
import styled from "styled-components";
import LoadingIcon from "../../Icons/LoadingIcon";

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
    display: flex;
    transition: background-color: .2s;
    position: relative;
    &.active {
      cursor: not-allowed;
    }
`;

interface ButtonProps {
  type: 'button' | 'submit';
  text: string;
  onSubmit: () => Promise<void>;
  loading?: boolean;
}

const Button: FunctionComponent<ButtonProps> = (props) => {
  return <ButtonItem type={props.type} className={props.loading ? "active" : ""}
                     onClick={props.onSubmit} disabled={props.loading}>{props.loading &&
  <LoadingIcon position="absolute" left="15px"/>}{props.text}</ButtonItem>
};

export default Button;