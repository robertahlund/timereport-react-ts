import React, { FunctionComponent, Fragment, ChangeEvent } from "react";
import Input from "../general/Input";
import { Row } from "../authentication/RegisterForm";
import {Activity} from "../../types/types";

interface ActivityFormProps {
  form: Activity;
  onFormChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const ActivityForm: FunctionComponent<ActivityFormProps> = props => {
  const { name } = props.form;
  return (
    <Fragment>
      <form autoComplete="off">
        <Row direction="column">
            <Input
              value={name}
              labelValue="Name"
              type="text"
              name="name"
              onFormChange={props.onFormChange}
              width="378px"
            />
        </Row>
      </form>
    </Fragment>
  );
};

export default ActivityForm;
