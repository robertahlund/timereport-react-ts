import React, { FunctionComponent, Fragment, ChangeEvent } from "react";
import Input from "../general/Input";
import { Row } from "../authentication/RegisterForm";
import {ActivityFormValue} from "../../types/types";

interface ActivityFormProps {
  form: ActivityFormValue;
  onFormChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const ActivityForm: FunctionComponent<ActivityFormProps> = props => {
  const { name } = props.form;
  return (
    <Fragment>
      <form autoComplete="off">
        <Row direction="column">
            <Input
              value={name.value}
              labelValue="Name"
              type="text"
              name="name"
              onFormChange={props.onFormChange}
              width="378px"
              valid={name.valid}
              validationMessage={name.validationMessage}
            />
        </Row>
      </form>
    </Fragment>
  );
};

export default ActivityForm;
