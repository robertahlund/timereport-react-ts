import React, {Fragment, FunctionComponent} from 'react';
import styled from "styled-components";

const Label = styled.label`
    display: block;
    font-size: 14px;
    font-weight: 500;
    padding: 0 0 3px 0;
    &:not(:first-child) {
        padding-top: 15px;
    }
`;

const InputField = styled.input`
    background-color: #FBFBFB;
    border-radius: 3px;
    border: 1px solid #F1F1F1;
    padding: 10px;
    width: 300px;
`;

interface InputProps {
    value: string;
    labelValue: string;
    type: 'number' | 'text' | 'password';
    name: string;
    onFormChange: (value: string) => void;
    width: string;
}

const Input: FunctionComponent<InputProps> = props => {
    return (
        <Fragment>
            <Label htmlFor={props.name}>{props.labelValue}</Label>
            <InputField id={props.name} name={props.name} value={props.value} type={props.type}
                        onChange={(event: any) => props.onFormChange(event.target.value)} autoComplete="off"/>
        </Fragment>
    );
};

export default Input;