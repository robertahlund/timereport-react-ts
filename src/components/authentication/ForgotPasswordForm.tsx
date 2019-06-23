import React, {ChangeEvent, FunctionComponent} from 'react';
import Input from "../general/Input";

interface ForgotPasswordFormProps {
  email: string;
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const ForgotPasswordForm: FunctionComponent<ForgotPasswordFormProps> = props => {
  return (
    <form>
      <Input name="email" value={props.email} labelValue="Email" type="text" onFormChange={props.onEmailChange}
             width="300px"/>
    </form>
  )
};

export default ForgotPasswordForm;