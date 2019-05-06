import React, {
  FunctionComponent,
  Fragment,
  ChangeEvent
} from "react";
import Input from "../general/Input";
import {Row} from "../authentication/RegisterForm";
import {PaddingRow} from "../authentication/LoginForm";
import {ValueType} from "react-select/lib/types";
import Select from "react-select";
import {SmallerHeading} from "../employees/EmployeeModalForm";
import {ActivitySelectOptions, Company} from "../../types/types";

interface CompanyFormProps {
  form: Company;
  onFormChange: (event: ChangeEvent<HTMLInputElement>) => void;
  selectOptions: ActivitySelectOptions[];
  handleSelectChange: (value: ValueType<object>) => void;
}

const CompanyForm: FunctionComponent<CompanyFormProps> = props => {
  const {name, orgNumber} = props.form;
  const {selectOptions} = props;
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
        <Row direction="column">
          <SmallerHeading>Activities</SmallerHeading>
          <Select onChange={props.handleSelectChange} options={selectOptions} placeholder="Select Activities"
                  value={null} classNamePrefix="react-select" className="react-select"/>
        </Row>
      </form>
    </Fragment>
  );
};

export default CompanyForm;
