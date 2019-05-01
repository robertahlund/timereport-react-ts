import React, { ChangeEvent, Fragment, FunctionComponent } from "react";
import styled from "styled-components";

interface InputProps {
  value?: string;
  labelValue?: string;
  type: "number" | "text" | "password";
  name?: string;
  onFormChange: (
    event: ChangeEvent<HTMLInputElement>,
    timeReportIndex?: number,
    timeReportRowIndex?: number
  ) => void;
  width: string;
  textAlign?: "left" | "right";
  timeReportIndex?: number;
  timeReportRowIndex?: number;
  fontWeight?: string;
}

interface InputFieldProps {
  width: string;
  textAlign?: string;
  fontWeight?: string;
}

export const Label = styled.label`
  display: block;
  font-size: 15px;
  font-weight: 500;
  padding: 0 0 3px 0;
  cursor: pointer;
`;

const InputField = styled.input`
  background-color: #fbfbfb;
  border-radius: 3px;
  border: 1px solid #f1f1f1;
  padding: 10px;
  font-size: 15px;
  width: ${(props: InputFieldProps) => props.width};
  text-align: ${(props: InputFieldProps) =>
    props.textAlign ? props.textAlign : "left"};
  font-weight: ${(props: InputFieldProps) =>
    props.fontWeight ? props.fontWeight : 400};
`;

const Input: FunctionComponent<InputProps> = props => {
  return (
    <div>
      {props.labelValue && (
        <Label htmlFor={props.name}>{props.labelValue}</Label>
      )}
      <InputField
        width={props.width}
        id={props.name}
        name={props.name}
        value={props.value}
        type={props.type}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          props.onFormChange(
            event,
            props.timeReportIndex,
            props.timeReportRowIndex
          )
        }
        autoComplete="off"
        textAlign={props.textAlign}
        fontWeight={props.fontWeight}
      />
    </div>
  );
};

export default Input;
