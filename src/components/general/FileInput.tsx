import React, { ChangeEvent, FunctionComponent } from "react";
import styled from "styled-components";

interface FileInputProps {
  uploadInput: React.RefObject<HTMLInputElement>;
  filename: string;
  onFileChange: (files: FileList | null) => void;
}

const FileInput: FunctionComponent<FileInputProps> = props => {
  const { uploadInput, filename, onFileChange } = props;
  return (
    <>
      <Label htmlFor="file">{filename || "Upload File"}</Label>
      <Input id="file" type="file" ref={uploadInput} onChange={(event) => onFileChange(event.target.files)}/>
    </>
  );
};

export default FileInput;

const Input = styled.input`
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute !important;
  white-space: nowrap;
  width: 1px;
`;

const Label = styled.label`
  background-color: #fbfbfb;
  border-radius: 3px;
  color: #393E41;
  cursor: pointer;
  display: block;
  font-size: 14px;
  font-weight: 400;
  padding: 20px 0 20px 20px;
  border: 1px solid #f1f1f1;
  width: calc(400px - 22px);
  margin-top: 3px;
`;
