import React, { ChangeEvent, Fragment, FunctionComponent } from "react";
import styled from "styled-components";
import {TimeReport} from "../../types/types";

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
  saveSingleRow?: (
    timeReportIndex?: number,
    timeReportRowIndex?: number
  ) => Promise<void>;
  valid?: boolean;
  validationMessage?: string;
}

interface InputFieldProps {
  width: string;
  textAlign?: string;
  fontWeight?: string;
  valid?: boolean;
}

const Input: FunctionComponent<InputProps> = props => {
  return (
    <RelativeContainer>
      {props.labelValue && (
        <Label htmlFor={props.name}>{props.labelValue}</Label>
      )}
      <InputField
        width={props.width}
        id={props.name}
        name={props.name}
        value={props.value}
        type={props.type}
        valid={props.valid === undefined ? true : props.valid}
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
        onBlur={() =>
          props.saveSingleRow
            ? props.saveSingleRow(
                props.timeReportIndex,
                props.timeReportRowIndex
              )
            : null
        }
      />
      {!props.valid && <ErrorMessage>{props.validationMessage}</ErrorMessage>}
    </RelativeContainer>
  );
};

export default Input;

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
  border: ${(props: InputFieldProps) => props.valid ? "1px solid #f1f1f1;" : "1px solid #FE9161;"}
  padding: 10px;
  font-size: 15px;
  width: ${(props: InputFieldProps) => props.width};
  text-align: ${(props: InputFieldProps) =>
  props.textAlign ? props.textAlign : "left"};
  font-weight: ${(props: InputFieldProps) =>
  props.fontWeight ? props.fontWeight : 400};
`;

const RelativeContainer = styled.div`
  position: relative;
`;

const ErrorMessage = styled.span`
  color: #FE9161;
  font-size: 12px;
  display: block;
  padding: 5px 0;
`;
