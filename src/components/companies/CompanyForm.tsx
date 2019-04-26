import React, {
  FunctionComponent,
  Fragment,
  ChangeEvent
} from "react";
import Input from "../general/Input";
import {Row} from "../authentication/RegisterForm";
import {Company} from "./CompanyList";
import {PaddingRow} from "../authentication/LoginForm";


interface CompanyFormProps {
  form: Company;
  onFormChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const CompanyForm: FunctionComponent<CompanyFormProps> = props => {
  const {name, orgNumber} = props.form;
  return (
    <Fragment>
      <form autoComplete="off">
        <Row direction="column">
          <PaddingRow>
            <Input
              value={name}
              labelValue="Name"
              type="text"
              name="name"
              onFormChange={props.onFormChange}
              width="378px"
            />
          </PaddingRow>
          <Input
            value={orgNumber}
            labelValue="Org. number"
            type="text"
            name="orgNumber"
            onFormChange={props.onFormChange}
            width="378px"
          />
        </Row>
      </form>
    </Fragment>
  );
};

export default CompanyForm;
