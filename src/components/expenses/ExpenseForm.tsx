import React, { FunctionComponent, Fragment, ChangeEvent } from "react";
import Input from "../general/Input";
import { Row } from "../authentication/RegisterForm";
import { ExpenseFormValue } from "../../types/types";
import TextArea from "../general/TextArea";
import FileInput from "../general/FileInput";

interface ExpenseFormProps {
  form: ExpenseFormValue;
  onFormChange: (event: ChangeEvent<HTMLInputElement>) => void;
  uploadInput: React.RefObject<HTMLInputElement>;
}

const ExpenseForm: FunctionComponent<ExpenseFormProps> = props => {
  const { uploadInput } = props;
  const { amount, vat, note } = props.form;
  return (
    <Fragment>
      <form autoComplete="off">
        <FileInput uploadInput={uploadInput}/>
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
        <Row direction="column">
          <TextArea
            value={note.value}
            labelValue="Note"
            type="text"
            name="note"
            onFormChange={props.onFormChange}
            width="378px"
            valid={note.valid}
            validationMessage={note.validationMessage}
          />
        </Row>
      </form>
    </Fragment>
  );
};

export default ExpenseForm;
