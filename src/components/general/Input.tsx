import React, { ChangeEvent, Fragment, FunctionComponent } from "react";
import styled from "styled-components";

interface InputProps {
  value?: string;
  labelValue: string;
  type: "number" | "text" | "password";
  name: string;
  onFormChange: (event: ChangeEvent<HTMLInputElement>) => void;
  width: string;
}

const Label = styled.label`
  display: block;
  font-size: 15px;
  font-weight: 500;
  padding: 0 0 3px 0;
`;

const InputField = styled.input`
  background-color: #fbfbfb;
  border-radius: 3px;
  border: 1px solid #f1f1f1;
  padding: 10px;
  font-size: 15px;
  width: ${props => props.width};
`;

const Input: FunctionComponent<InputProps> = props => {
  return (
    <div>
      <Label htmlFor={props.name}>{props.labelValue}</Label>
      <InputField
        width={props.width}
        id={props.name}
        name={props.name}
        value={props.value}
        type={props.type}
        onChange={(event: ChangeEvent<HTMLInputElement>) => props.onFormChange(event)}
        autoComplete="off"
      />
    </div>
  );
};

export default Input;
