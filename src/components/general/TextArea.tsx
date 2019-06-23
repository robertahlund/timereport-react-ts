import React, {ChangeEvent, FunctionComponent} from "react";
import styled from "styled-components";

interface TextAreaProps {
  value?: string;
  labelValue?: string;
  type: "number" | "text" | "password";
  name?: string;
  onFormChange: (
    event: ChangeEvent<any>
  ) => void;
  width: string;
  textAlign?: "left" | "right";
  fontWeight?: string;
  valid?: boolean;
  validationMessage?: string;
  height?: string;
}

interface TextAreaFieldProps {
  width: string;
  textAlign?: string;
  fontWeight?: string;
  valid?: boolean;
  height?: string;
}

const TextArea: FunctionComponent<TextAreaProps> = props => {
  return (
    <RelativeContainer>
      {props.labelValue && (
        <Label htmlFor={props.name}>{props.labelValue}</Label>
      )}
      <TextAreaField
        width={props.width}
        id={props.name}
        name={props.name}
        value={props.value}
        valid={props.valid === undefined ? true : props.valid}
        onChange={props.onFormChange}
        autoComplete="off"
        textAlign={props.textAlign}
        fontWeight={props.fontWeight}
        height={props.height}
      />
      {!props.valid &&
      props.valid !== undefined && (
        <ErrorMessage>{props.validationMessage}</ErrorMessage>
      )}
    </RelativeContainer>
  );
};

export default TextArea;

export const Label = styled.label`
  display: block;
  font-size: 15px;
  font-weight: 500;
  padding: 0 0 3px 0;
  cursor: pointer;
`;

const TextAreaField = styled.textarea`
  background-color: #fbfbfb;
  border-radius: 3px;
  border: ${(props: TextAreaFieldProps) =>
  props.valid ? "1px solid #f1f1f1;" : "1px solid #FE9161;"};
  padding: 10px;
  font-size: 15px;
  width: ${(props: TextAreaFieldProps) => props.width};
  height: ${(props: TextAreaFieldProps) => props.height};
  text-align: ${(props: TextAreaFieldProps) =>
  props.textAlign ? props.textAlign : "left"};
  font-weight: ${(props: TextAreaFieldProps) =>
  props.fontWeight ? props.fontWeight : 400};
  font-family: 'Roboto', sans-serif;
`;

const RelativeContainer = styled.div`
  position: relative;
`;

const ErrorMessage = styled.span`
  color: #fe9161;
  font-size: 12px;
  display: block;
  padding: 5px 0;
`;
