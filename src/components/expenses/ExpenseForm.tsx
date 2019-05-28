import React, { FunctionComponent, Fragment, ChangeEvent } from "react";
import Input from "../general/Input";
import { Row } from "../authentication/RegisterForm";
import { ExpenseFormValue } from "../../types/types";

interface ActivityFormProps {
  form: ExpenseFormValue;
  onFormChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const ExpenseForm: FunctionComponent<ActivityFormProps> = props => {
  const { amount, vat, note } = props.form;
  return (
    <Fragment>
      <form autoComplete="off">
        <Row direction="column">
          <Input
            value={amount.value}
            labelValue="Amount"
            type="text"
            name="amount"
            onFormChange={props.onFormChange}
            width="378px"
            valid={amount.valid}
            validationMessage={amount.validationMessage}
          />
          <Input
            value={vat.value}
            labelValue="VAT"
            type="text"
            name="vat"
            onFormChange={props.onFormChange}
            width="378px"
            valid={vat.valid}
            validationMessage={vat.validationMessage}
          />
          <Input
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
