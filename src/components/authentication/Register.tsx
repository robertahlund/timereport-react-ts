import React, {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useState
} from "react";
import Button from "../general/Button";
import {Section, Wrapper} from "./Login";
import RegisterForm from "./RegisterForm";
import {createEmployee} from "../../api/employeeApi";
import {toast} from "react-toastify";
import {validateRegisterForm} from "../../utilities/validations/validateRegisterForm";
import {RegisterFormValue} from "../../types/types";
import {initialRegisterForm} from "../../constants/registerConstants";
import _ from "lodash";

const Register: FunctionComponent = () => {
  const [form, setForm] = useState<RegisterFormValue>(initialRegisterForm);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkbox, setCheckbox] = useState<boolean>(false);

  useEffect(() => {
    document.title = "Register";
  }, []);

  const handleFormChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setForm({
      ...form,
      [event.target.name]: {
        valid: true,
        validationMessage: "",
        value: event.target.value
      }
    });
  };

  const formSubmit = async (): Promise<void> => {
    const validatedForm: RegisterFormValue = _.cloneDeep(validateRegisterForm(form));
    if (!validatedForm.valid) {
      console.log(validatedForm);
      setForm(validatedForm);
      return;
    }
    const {firstName, lastName, email, password} = form;
    try {
      setLoading(true);
      const success: string = await createEmployee(
        firstName!.value!,
        lastName!.value!,
        email!.value!,
        password!.value!,
        checkbox
      );
      toast.success(success);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
    console.log(firstName, lastName, email, password);
  };

  return (
    <Wrapper>
      <Section>
        <h3>Create new account</h3>
        <RegisterForm
          onFormChange={handleFormChange}
          onCheckboxChange={(event: ChangeEvent<HTMLInputElement>) =>
            setCheckbox(event.target.checked)
          }
          form={form}
          checked={checkbox}
        />
        <Button
          type="button"
          text="Create"
          loading={loading}
          onSubmit={formSubmit}
        />
      </Section>
    </Wrapper>
  );
};

export default Register;
