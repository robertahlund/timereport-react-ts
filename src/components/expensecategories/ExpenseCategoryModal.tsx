import React, {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useState
} from "react";
import CloseIcon from "../../icons/CloseIcon";
import Button from "../general/Button";
import {
  ModalBackground,
  ModalContent,
  ModalHeader,
  ModalTitle,
  Section
} from "../account/MyAccountModal";
import LoadingIcon from "../../icons/LoadingIcon";
import ExpenseCategoryForm from "./ExpenseCategoryForm";
import { toast } from "react-toastify";
import { ExpenseCategory, ExpenseCategoryFormValue } from "../../types/types";
import { useSpring } from "react-spring";
import { modalAnimation } from "../../constants/generalConstants";
import { initialExpenseCategoryForm } from "../../constants/expenseConstants";
import {
  createExpenseCategory,
  deleteExpenseCategory,
  getExpenseCategoryById,
  updateExpenseCategory
} from "../../api/expenseCategoryApi";
import { validateExpenseCategoryForm } from "../../utilities/validations/validateExpenseCategoryForm";
import { ButtonRow } from "../activities/ActivityModal";
import _ from "lodash";

interface ExpenseCategoryModalProps {
  toggleModal: (event?: React.MouseEvent) => void;
  expenseCategoryId: string;
  getExpenseCategories: () => Promise<void>;
}

const ExpenseCategoryModal: FunctionComponent<
  ExpenseCategoryModalProps
> = props => {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(true);

  const [expenseCategory, setExpenseCategory] = useState(
    initialExpenseCategoryForm
  );
  const [originalExpenseCategory, setOriginalExpenseCategory] = useState(
    initialExpenseCategoryForm
  );
  const [isNew, setIsNew] = useState(props.expenseCategoryId === "");

  useEffect(() => {
    if (!isNew) {
      _getExpenseCategoryById();
    }
  }, []);

  const _getExpenseCategoryById = async (): Promise<void> => {
    try {
      const { expenseCategoryId } = props;
      const expenseCategoryData: ExpenseCategory = await getExpenseCategoryById(
        expenseCategoryId
      );
      setModalLoading(false);
      if (!_.isNil(expenseCategoryId)) {
        setExpenseCategory({
          id: expenseCategoryData!.id,
          valid: true,
          name: {
            valid: true,
            validationMessage: "",
            value: expenseCategoryData!.name
          }
        });
        setOriginalExpenseCategory({
          id: expenseCategoryData!.id,
          valid: true,
          name: {
            valid: true,
            validationMessage: "",
            value: expenseCategoryData!.name
          }
        });
      } else {
        toast.error("Error retrieving expense category.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFormChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setExpenseCategory({
      ...expenseCategory,
      [event.target.name]: {
        valid: true,
        validationMessage: "",
        value: event.target.value
      }
    });
  };

  const _updateExpenseCategory = async (): Promise<void> => {
    await updateExpenseCategory({
      id: expenseCategory.id,
      name: expenseCategory.name.value
    });
    setOriginalExpenseCategory({
      ...originalExpenseCategory,
      name: {
        ...originalExpenseCategory.name,
        value: expenseCategory.name.value
      }
    });
  };

  const _createExpenseCategory = async (): Promise<void> => {
    const expenseCategoryId: string = await createExpenseCategory({
      id: expenseCategory.id,
      name: expenseCategory.name.value
    });
    toast.success(`Successfully created ${expenseCategory.name.value}!`);
    setExpenseCategory({ ...expenseCategory, id: expenseCategoryId });
    setOriginalExpenseCategory({ ...expenseCategory, id: expenseCategoryId });
    setIsNew(false);
    setModalLoading(false);
  };

  const onSubmit = async (): Promise<void> => {
    const validatedForm: ExpenseCategoryFormValue = {
      ...validateExpenseCategoryForm(expenseCategory)
    };
    if (!validatedForm.valid) {
      setExpenseCategory(validatedForm);
      return;
    }
    setLoading(true);
    if (isNew) {
      await _createExpenseCategory();
    } else {
      await _updateExpenseCategory();
    }
    props.getExpenseCategories();
    setLoading(false);
  };

  const _deleteExpenseCategory = async (): Promise<void> => {
    setDeleteLoading(true);
    await deleteExpenseCategory(expenseCategory.id);
    toast.success(`Successfully deleted ${expenseCategory.name.value}.`);
    props.toggleModal();
    // noinspection JSIgnoredPromiseFromCall
    props.getExpenseCategories();
  };

  const animation = useSpring(modalAnimation);

  return (
    <ModalBackground onClick={props.toggleModal}>
      {modalLoading && !isNew ? (
        <LoadingIcon
          position="relative"
          left="0px"
          height="100px"
          width="100px"
          color="#393e41"
        />
      ) : (
        <ModalContent style={animation}>
          <ModalHeader>
            <ModalTitle>
              {isNew
                ? "Create new expense category"
                : originalExpenseCategory.name.value}
            </ModalTitle>
            <CloseIcon
              color="#fff"
              background={true}
              backgroundColor="#fec861"
              onClick={props.toggleModal}
              margin="20px 20px 0 0"
              height="24px"
              width="24px"
            />
          </ModalHeader>
          <Section>
            <ExpenseCategoryForm
              form={expenseCategory}
              onFormChange={onFormChange}
            />
            <ButtonRow isNew={isNew}>
              {!isNew && (
                <Button
                  type="button"
                  text="Delete"
                  onSubmit={_deleteExpenseCategory}
                  buttonType="Delete"
                  loading={deleteLoading}
                />
              )}
              <Button
                type="button"
                text={isNew ? "Create" : "Update"}
                loading={loading}
                onSubmit={onSubmit}
              />
            </ButtonRow>
          </Section>
        </ModalContent>
      )}
    </ModalBackground>
  );
};

export default ExpenseCategoryModal;
