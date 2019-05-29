import React, { ChangeEvent, FunctionComponent } from "react";

interface FileInputProps {
  uploadInput: React.RefObject<HTMLInputElement>
}

const FileInput: FunctionComponent<FileInputProps> = props => {
  const { uploadInput } = props;
  console.log(uploadInput)
  return (
    <input type="file" ref={uploadInput}/>
  );
};

export default FileInput;