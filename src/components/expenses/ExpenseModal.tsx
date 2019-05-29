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
import ExpenseForm from "./ExpenseForm";
import { toast } from "react-toastify";
import { Expense, ExpenseFormValue } from "../../types/types";
import { useSpring } from "react-spring";
import { modalAnimation } from "../../constants/generalConstants";
import { initialExpenseForm } from "../../constants/expenseConstants";
import { ButtonRow } from "../activities/ActivityModal";
import _ from "lodash";
import {
  createExpense,
  deleteExpense,
  getExpenseById,
  updateExpense
} from "../../api/expenseApi";
import { validateExpenseForm } from "../../utilities/validations/validateExpenseForm";
import firebase from "../../config/firebaseConfig"

interface ExpenseModalProps {
  toggleModal: (event?: React.MouseEvent) => void;
  expenseId: string;
  getExpenses: () => Promise<void>;
}

const ExpenseModal: FunctionComponent<ExpenseModalProps> = props => {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(true);

  const [expense, setExpense] = useState(initialExpenseForm);
  const [isNew, setIsNew] = useState(props.expenseId === "");

  const uploadInput: React.RefObject<HTMLInputElement> = React.createRef();

  useEffect(() => {
    if (!isNew) {
      // noinspection JSIgnoredPromiseFromCall
      _getExpenseById();
    }
  }, []);

  const _getExpenseById = async (): Promise<void> => {
    const { expenseId } = props;
    const expenseData: Expense | undefined = await getExpenseById(expenseId);
    setModalLoading(false);
    if (!_.isNil(expenseId)) {
      setExpense({
        id: expenseData!.id,
        userId: expenseData!.userId,
        expenseCategoryId: expenseData!.expenseCategoryId,
        valid: true,
        amount: {
          valid: true,
          validationMessage: "",
          value: String(expenseData!.amount)
        },
        vat: {
          valid: true,
          validationMessage: "",
          value: String(expenseData!.vat)
        },
        note: {
          valid: true,
          validationMessage: "",
          value: expenseData!.note
        },
        receiptUrl: expenseData!.receiptUrl
      });
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

  const _updateExpense = async (): Promise<void> => {
    await updateExpense({
      id: expense.id,
      userId: expense.userId,
      expenseCategoryId: expense.expenseCategoryId,
      amount: Number(expense.amount.value),
      vat: Number(expense.vat.value),
      note: expense.note.value,
      receiptUrl: expense.receiptUrl
    });
  };

  const _createExpense = async (): Promise<void> => {
    const expenseId: string = await createExpense({
      id: expense.id,
      userId: expense.userId,
      expenseCategoryId: expense.expenseCategoryId,
      amount: Number(expense.amount.value),
      vat: Number(expense.vat.value),
      note: expense.note.value,
      receiptUrl: expense.receiptUrl
    });
    toast.success("Successfully created expense!");
    setExpense({ ...expense, id: expenseId });
    setIsNew(false);
    setModalLoading(false);
  };

  const onSubmit = async (): Promise<void> => {

    if (!_.isNil(uploadInput.current) && !_.isNil(uploadInput.current.files)) {
      const file: File = uploadInput.current.files[0];
      console.log(file)
      const storageService = firebase.storage();
      const storageRef = storageService.ref();
      const uploadProcess = storageRef.child(`receipts/${file.name}`)
        .put(file);
      uploadProcess.on('state_changed', snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`)
      }, error => {
        console.log(error)
      }, () => {
        uploadProcess.snapshot.ref.getDownloadURL().then(url => {
          console.log(url);
          toast.success(`Upload successful, visit ${url} to view it.`, {autoClose: false})
        })
      })
    }
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
            <ExpenseForm form={expense} onFormChange={onFormChange} uploadInput={uploadInput}/>
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
