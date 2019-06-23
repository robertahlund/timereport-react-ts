import React, { FunctionComponent, Fragment, ChangeEvent } from "react";
import Input, {ErrorMessage, Label} from "../general/Input";
import { RowProps } from "../authentication/RegisterForm";
import {
  ExpenseCategorySelectOptions,
  ExpenseFormValue
} from "../../types/types";
import TextArea from "../general/TextArea";
import FileInput from "../general/FileInput";
import Select from "react-select";
import { ValueType } from "react-select/lib/types";
import styled from "styled-components";

interface ExpenseFormProps {
  form: ExpenseFormValue;
  onFormChange: (event: ChangeEvent<HTMLInputElement>) => void;
  uploadInput: React.RefObject<HTMLInputElement>;
  selectOptions: ExpenseCategorySelectOptions[];
  handleSelectChange: (option: ValueType<any>) => void;
  selectedValue: ExpenseCategorySelectOptions | null;
  filename: string;
  onFileChange: (files: FileList | null) => void;
  fileValidationMessage: null | string;
  expenseCategoryValidationMessage: null | string;
}

const ExpenseForm: FunctionComponent<ExpenseFormProps> = props => {
  const {
    uploadInput,
    selectOptions,
    handleSelectChange,
    selectedValue,
    filename,
    onFileChange,
    fileValidationMessage,
    expenseCategoryValidationMessage
  } = props;
  const { amount, vat, note } = props.form;

  return (
    <Fragment>
      <form autoComplete="off">
        <PaddingRow>
          <Label>Attachment
          <FileInput uploadInput={uploadInput} filename={filename} onFileChange={onFileChange} hasError={fileValidationMessage !== null}/>
          </Label>
          {fileValidationMessage !== null && <ErrorMessage>{fileValidationMessage}</ErrorMessage>}
        </PaddingRow>
        <PaddingRow>
          <Row direction="row">
            <Input
              value={amount.value}
              labelValue="Amount"
              type="text"
              name="amount"
              onFormChange={props.onFormChange}
              width="171px"
              valid={amount.valid}
              validationMessage={amount.validationMessage}
            />
            <Input
              value={vat.value}
              labelValue="VAT"
              type="text"
              name="vat"
              onFormChange={props.onFormChange}
              width="171px"
              valid={vat.valid}
              validationMessage={vat.validationMessage}
            />
          </Row>
        </PaddingRow>
        <Row direction="column">
          <PaddingRow>
            <TextArea
              value={note.value}
              labelValue="Note"
              type="text"
              name="note"
              onFormChange={props.onFormChange}
              width="378px"
              valid={note.valid}
              validationMessage={note.validationMessage}
              height="100px"
            />
          </PaddingRow>
          <PaddingRow>
            <Label>Select Category</Label>
            <Select
              onChange={handleSelectChange}
              options={selectOptions}
              placeholder="Select Category"
              value={selectedValue}
              classNamePrefix={expenseCategoryValidationMessage !== null ? "react-select-time-error" : "react-select-time"}
              className={expenseCategoryValidationMessage !== null ? "react-select-time-error" : "react-select-time"}
            />
            {expenseCategoryValidationMessage !== null && <ErrorMessage>{expenseCategoryValidationMessage}</ErrorMessage>}
          </PaddingRow>
        </Row>
      </form>
    </Fragment>
  );
};

export const Row = styled.div`
  display: flex;
  width: 400px;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: ${(props: RowProps) => props.direction};
`;

const PaddingRow = styled.div`
  padding-bottom: 15px;
`;

export default ExpenseForm;
