import React, {
  ChangeEvent,
  FunctionComponent,
  useContext,
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
import ExpenseForm from "./ExpenseForm";
import { toast } from "react-toastify";
import {
  ActivityCompanySelectOption,
  AuthObject,
  Expense,
  ExpenseCategory,
  ExpenseCategorySelectOptions,
  ExpenseFileUpload,
  ExpenseFormValue,
  GroupedActivityOptions
} from "../../types/types";
import { useSpring } from "react-spring";
import { modalAnimation } from "../../constants/generalConstants";
import {
  initialExpenseCategoryOptions,
  initialExpenseForm,
  initialSelectedExpenseCategory
} from "../../constants/expenseConstants";
import { ButtonRow } from "../activities/ActivityModal";
import _ from "lodash";
import {
  createExpense,
  deleteExpense,
  getExpenseById,
  updateExpense,
  uploadExpenseFile
} from "../../api/expenseApi";
import { validateExpenseForm } from "../../utilities/validations/validateExpenseForm";
import { ValueType } from "react-select/lib/types";
import {
  getExpenseCategories,
  getExpenseCategoryById
} from "../../api/expenseCategoryApi";
import { AuthContext } from "../../context/authentication/authenticationContext";

interface ExpenseModalProps {
  toggleModal: (event?: React.MouseEvent) => void;
  expenseId: string;
  getExpenses: () => Promise<void>;
}

const ExpenseModal: FunctionComponent<ExpenseModalProps> = props => {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(true);
  const [
    expenseCategorySelectOptions,
    setExpenseCategorySelectOptions
  ] = useState(initialExpenseCategoryOptions);
  const [expense, setExpense] = useState(initialExpenseForm);
  const [isNew, setIsNew] = useState(props.expenseId === "");
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState(
    initialSelectedExpenseCategory
  );
  const [filename, setFilename] = useState("");
  const uploadInput: React.RefObject<HTMLInputElement> = React.createRef();

  const user = useContext(AuthContext);

  useEffect(() => {
    if (!isNew) {
      // noinspection JSIgnoredPromiseFromCall
      getInitialData();
    } else {
      // noinspection JSIgnoredPromiseFromCall
      _getExpenseCategories();
    }
  }, []);

  const getInitialData = (): void => {
    // noinspection JSIgnoredPromiseFromCall
    _getExpenseCategories();
    // noinspection JSIgnoredPromiseFromCall
    _getExpenseById();
  };

  const _getExpenseCategories = async (): Promise<void> => {
    const expenseCategories:
      | ExpenseCategory[]
      | undefined = await getExpenseCategories();
    if (!_.isNil(expenseCategories)) {
      createOptionList(expenseCategories);
    }
  };

  const createOptionList = (expenseCategories: ExpenseCategory[]): void => {
    const optionList: ExpenseCategorySelectOptions[] = [];
    _.forEach(expenseCategories, (expenseCategory: ExpenseCategory) => {
      optionList.push({
        label: expenseCategory.name,
        value: expenseCategory.id
      });
    });
    setExpenseCategorySelectOptions(optionList);
  };

  const handleSelectChange = (option: ValueType<any>): void => {
    setSelectedExpenseCategory(option);
    setExpense({
      ...expense,
      expenseCategoryId: option.value
    });
  };

  const _getExpenseById = async (): Promise<void> => {
    const { expenseId } = props;
    const expenseData: Expense | undefined = await getExpenseById(expenseId);
    if (!_.isNil(expenseId) && expenseData) {
      const expenseCategory:
        | ExpenseCategory
        | undefined = await getExpenseCategoryById(
        expenseData.expenseCategoryId
      );
      if (expenseCategory) {
        setSelectedExpenseCategory({
          value: expenseCategory.id,
          label: expenseCategory.name
        })
      }
      setExpense({
        id: expenseData.id,
        userId: expenseData.userId,
        expenseCategoryId: expenseData.expenseCategoryId,
        valid: true,
        amount: {
          valid: true,
          validationMessage: "",
          value: String(expenseData.amount)
        },
        vat: {
          valid: true,
          validationMessage: "",
          value: String(expenseData.vat)
        },
        note: {
          valid: true,
          validationMessage: "",
          value: expenseData.note
        },
        filename: expenseData.filename,
        receiptUrl: expenseData.receiptUrl
      });
      setModalLoading(false);
      setFilename(expenseData.filename);
    } else {
      toast.error("Error retrieving expense.");
    }
  };

  const onFormChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setExpense({
      ...expense,
      [event.target.name]: {
        valid: true,
        validationMessage: "",
        value: event.target.value
      }
    });
  };

  const onFileChange = (files: FileList | null): void => {
    if (!_.isNil(files) && !_.isNil(files[0])) {
      setFilename(files[0].name);
    } else {
      setFilename("");
    }
  };

  const _updateExpense = async (): Promise<void> => {
    //check if user has uploaded a new file
    //if so, we should not generate a new uuid in upload expense file method
    try {
      if (
        !_.isNil(uploadInput.current) &&
        !_.isNil(uploadInput.current.files)
      ) {
        const uploadedFile:
          | ExpenseFileUpload
          | undefined = await uploadExpenseFile(uploadInput.current.files[0]);
        if (uploadedFile && typeof user === "object") {
          await updateExpense({
            id: expense.id,
            userId: user.uid as string,
            expenseCategoryId: expense.expenseCategoryId,
            amount: Number(expense.amount.value),
            vat: Number(expense.vat.value),
            note: expense.note.value,
            filename: uploadedFile.filename,
            receiptUrl: uploadedFile.url
          });
        } else {
          await updateExpense({
            id: expense.id,
            userId: expense.userId,
            expenseCategoryId: expense.expenseCategoryId,
            amount: Number(expense.amount.value),
            vat: Number(expense.vat.value),
            note: expense.note.value,
            filename: expense.filename,
            receiptUrl: expense.receiptUrl
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const _createExpense = async (): Promise<void> => {
    try {
      if (
        !_.isNil(uploadInput.current) &&
        !_.isNil(uploadInput.current.files)
      ) {
        const uploadedFile:
          | ExpenseFileUpload
          | undefined = await uploadExpenseFile(uploadInput.current.files[0]);
        if (
          uploadedFile &&
          !_.isNil(selectedExpenseCategory) &&
          typeof user === "object"
        ) {
          const expenseId: string = await createExpense({
            id: expense.id,
            userId: user.uid as string,
            expenseCategoryId: selectedExpenseCategory.value,
            amount: Number(expense.amount.value),
            vat: Number(expense.vat.value),
            note: expense.note.value,
            filename: uploadedFile.filename,
            receiptUrl: uploadedFile.url
          });
          toast.success("Successfully created expense!");
          setExpense({ ...expense, id: expenseId });
          setIsNew(false);
          setModalLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (): Promise<void> => {
    const validatedForm: ExpenseFormValue = {
      ...validateExpenseForm(expense)
    };
    if (!validatedForm.valid) {
      setExpense(validatedForm);
      return;
    }
    setLoading(true);
    if (isNew) {
      await _createExpense();
    } else {
      await _updateExpense();
    }
    // noinspection JSIgnoredPromiseFromCall
    props.getExpenses();
    setLoading(false);
  };

  const _deleteExpense = async (): Promise<void> => {
    setDeleteLoading(true);
    await deleteExpense(expense.id);
    toast.success("Successfully deleted expense!");
    props.toggleModal();
    // noinspection JSIgnoredPromiseFromCall
    props.getExpenses();
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
              {isNew ? "Create new expense" : "Update expense"}
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
            <ExpenseForm
              form={expense}
              onFormChange={onFormChange}
              uploadInput={uploadInput}
              selectOptions={expenseCategorySelectOptions}
              handleSelectChange={handleSelectChange}
              selectedValue={selectedExpenseCategory}
              filename={filename}
              onFileChange={onFileChange}
            />
            <ButtonRow isNew={isNew}>
              {!isNew && (
                <Button
                  type="button"
                  text="Delete"
                  onSubmit={_deleteExpense}
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

export default ExpenseModal;
