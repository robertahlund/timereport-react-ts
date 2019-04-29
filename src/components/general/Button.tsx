import React, {FunctionComponent} from 'react';
import styled from "styled-components";
import LoadingIcon from "../../Icons/LoadingIcon";

const ButtonItem = styled.button`
    align-self: flex-end;
    text-transform: uppercase;
    padding: 10px 50px;
    border: none;
    border-radius: 3px;
    background-color: ${(props: ButtonStyleProps) => props.buttonType === "Delete" ? '#FE9161' : '#FEC861'};
    margin-top: 25px;
    font-size: 14px;
    color: #393E41;
    cursor: pointer;
    display: flex;
    transition: background-color .2s;
    position: relative;
    &.active {
      cursor: not-allowed;
    }
`;

interface ButtonProps {
  type: 'button' | 'submit';
  text: string;
  onSubmit: (() => Promise<void>) | (() => void);
  loading?: boolean;
  buttonType?: ButtonType;
}

interface ButtonStyleProps {
  buttonType?: ButtonType;
}

type ButtonType = "Create" | "Delete";

const Button: FunctionComponent<ButtonProps> = (props) => {
  return <ButtonItem type={props.type} className={props.loading ? "active" : ""}
                     onClick={props.onSubmit} disabled={props.loading} buttonType={props.buttonType}>{props.loading &&
  <LoadingIcon position="absolute" left="15px" height="16px" width="24px" color="#393e41"/>}{props.text}</ButtonItem>
};

export default Button;