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
import {toast} from "react-toastify";
import {
  AuthObject,
  Expense,
  ExpenseCategory,
  ExpenseCategorySelectOptions,
  ExpenseFileUpload,
  ExpenseFormValue,
} from "../../types/types";
import {useSpring} from "react-spring";
import {modalAnimation} from "../../constants/generalConstants";
import {
  initialExpenseCategoryOptions,
  initialExpenseForm,
  initialSelectedExpenseCategory
} from "../../constants/expenseConstants";
import {ButtonRow} from "../activities/ActivityModal";
import _ from "lodash";
import {
  createExpense,
  deleteExpense,
  getExpenseById,
  updateExpense,
  uploadExpenseFile
} from "../../api/expenseApi";
import {validateExpenseForm} from "../../utilities/validations/validateExpenseForm";
import {ValueType} from "react-select/lib/types";
import {
  getExpenseCategories,
  getExpenseCategoryById
} from "../../api/expenseCategoryApi";
import {AuthContext} from "../../context/authentication/authenticationContext";
import {format} from "date-fns";
import {timeReportDateFormat} from "../../constants/timeReportConstants";


interface ExpenseModalProps {
  toggleModal: (event?: React.MouseEvent) => void;
  expenseId: string;
  getExpenses: () => Promise<void>;
}

const ExpenseModal: FunctionComponent<ExpenseModalProps> = props => {
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [modalLoading, setModalLoading] = useState<boolean>(true);
  const [
    expenseCategorySelectOptions,
    setExpenseCategorySelectOptions
  ] = useState<ExpenseCategorySelectOptions[]>(initialExpenseCategoryOptions);
  const [expense, setExpense] = useState<ExpenseFormValue>(initialExpenseForm);
  const [isNew, setIsNew] = useState<boolean>(props.expenseId === "");
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState<ExpenseCategorySelectOptions | null>(
    initialSelectedExpenseCategory
  );
  const [expenseCategoryValidationMessage, setExpenseCategoryValidationMessage] = useState<null | string>(null);
  const [filename, setFilename] = useState<string>("");
  const [fileValidationMessage, setFileValidationMessage] = useState<null | string>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const uploadInput: React.RefObject<HTMLInputElement> = React.createRef();

  const user: AuthObject | boolean = useContext(AuthContext);

  useEffect(() => {
    if (!isNew) {
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
    try {
      const expenseCategories: ExpenseCategory[] = await getExpenseCategories();
      if (!_.isNil(expenseCategories)) {
        createOptionList(expenseCategories);
      }
    } catch (error) {
      toast.error(error);
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
    setExpenseCategoryValidationMessage(null);
    setSelectedExpenseCategory(option);
    setExpense({
      ...expense,
      expenseCategoryId: option.value
    });
  };

  const _getExpenseById = async (): Promise<void> => {
    const {expenseId} = props;
    try {
      const expenseData: Expense = await getExpenseById(expenseId);
      if (!_.isNil(expenseId)) {
        const expenseCategory: ExpenseCategory = await getExpenseCategoryById(
          expenseData.expenseCategoryId
        );
        if (expenseCategory) {
          setSelectedExpenseCategory({
            value: expenseCategory.id,
            label: expenseCategory.name
          });
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
          date: {
            valid: true,
            validationMessage: "",
            value: expenseData.date
          },
          filename: expenseData.filename,
          receiptUrl: expenseData.receiptUrl
        });
        console.log(expenseData.date);
        if (!_.isNil(expenseData.date)) {
          setSelectedDate(new Date(expenseData.date));
        } else setSelectedDate(new Date());
        setModalLoading(false);
        setFilename(expenseData.filename)
      } else {
        toast.error("Error retrieving expense.");
      }
    } catch (error) {
      console.log(error);
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
    setFileValidationMessage(null);
  };

  const _updateExpense = async (): Promise<boolean> => {
    try {
      if (
        !_.isNil(uploadInput.current) &&
        !_.isNil(uploadInput.current.files) &&
        !_.isNil(uploadInput.current.files[0])
      ) {
        const uploadedFile: ExpenseFileUpload = await uploadExpenseFile(
          uploadInput.current.files[0],
          true,
          expense.filename
        );
        if (typeof user === "object") {
          await updateExpense({
            id: expense.id,
            userId: user.uid as string,
            expenseCategoryId: expense.expenseCategoryId,
            amount: Number(expense.amount.value),
            vat: Number(expense.vat.value),
            note: expense.note.value,
            filename: uploadedFile.filename,
            date: expense.date.value,
            receiptUrl: uploadedFile.url
          });
        }
      } else {
        await updateExpense({
          id: expense.id,
          userId: expense.userId,
          expenseCategoryId: expense.expenseCategoryId,
          amount: Number(expense.amount.value),
          vat: Number(expense.vat.value),
          note: expense.note.value,
          filename: expense.filename,
          date: expense.date.value,
          receiptUrl: expense.receiptUrl
        });
      }
      toast.success("Successfully updated expense!");
      return Promise.resolve(true);
    } catch (error) {
      console.log(error);
      return Promise.reject(false);
    }
  };

  const _createExpense = async (): Promise<boolean> => {
    try {
      if (validateUploadedFile() && !_.isNil(uploadInput.current) &&
        !_.isNil(uploadInput.current.files) &&
        !_.isNil(uploadInput.current.files[0])) {
        const uploadedFile: ExpenseFileUpload = await uploadExpenseFile(
          uploadInput.current.files[0]
        );
        if (
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
            date: expense.date.value,
            receiptUrl: uploadedFile.url
          });
          toast.success("Successfully created expense!");
          setExpense({...expense, id: expenseId});
          setIsNew(false);
          setModalLoading(false);
          return Promise.resolve(true);
        } else {
          return Promise.reject(false);
        }
      } else {
        setFileValidationMessage("File is mandatory");
        return Promise.reject(false);
      }
    } catch (error) {
      console.log(error);
      return Promise.reject(false);
    }
  };

  const validateUploadedFile = (): boolean => {
    return !_.isNil(uploadInput.current) &&
      !_.isNil(uploadInput.current.files) &&
      !_.isNil(uploadInput.current.files[0]);
  };

  const validateExpenseCategory = (): boolean => {
    return !_.isNil(selectedExpenseCategory);
  };

  const onSubmit = async (): Promise<void> => {
    if (isNew) {
      const fileUploaded = validateUploadedFile();
      if (!fileUploaded) {
        setFileValidationMessage("File is mandatory.");
      }
    }
    const validatedExpenseCategory = validateExpenseCategory();
    if (!validatedExpenseCategory) {
      setExpenseCategoryValidationMessage("Category is mandatory.");
    }
    const validatedForm: ExpenseFormValue = {
      ...validateExpenseForm(expense)
    };
    if (!validatedForm.valid || !_.isNil(fileValidationMessage) || !_.isNil(expenseCategoryValidationMessage)) {
      setExpense(validatedForm);
      return;
    }
    try {
      setLoading(true);
      if (isNew) {
        await _createExpense();
      } else {
        await _updateExpense();
      }
      // noinspection JSIgnoredPromiseFromCall
      props.getExpenses();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const _deleteExpense = async (): Promise<void> => {
    setDeleteLoading(true);
    await deleteExpense(expense.id, expense.filename);
    toast.success("Successfully deleted expense!");
    props.toggleModal();
    // noinspection JSIgnoredPromiseFromCall
    props.getExpenses();
  };

  const onDateSelect = async (date: Date): Promise<void> => {
    setSelectedDate(date);
    setExpense({
      ...expense,
      date: {
        valid: true,
        validationMessage: "",
        value: format(date, timeReportDateFormat)
      }
    });
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
              fileValidationMessage={fileValidationMessage}
              expenseCategoryValidationMessage={expenseCategoryValidationMessage}
              onDateSelect={onDateSelect}
              selectedDate={selectedDate}
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
