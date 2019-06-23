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
import ActivityForm from "./ActivityForm";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  createActivity,
  deleteActivity,
  getActivityById,
  updateActivity
} from "../../api/activityApi";
import {
  getCompaniesByActivityId,
  updateCompanies
} from "../../api/companyApi";
import { ActivityFormValue, Company, Activity } from "../../types/types";
import { updateTimeReportByActivityId } from "../../api/timeReportApi";
import { initialActivityState } from "../../constants/activityConstants";
import { validateActivityForm } from "../../utilities/validations/validateActivityForm";
import { useSpring } from "react-spring";
import { modalAnimation } from "../../constants/generalConstants";

export interface ButtonRowProps {
  isNew: boolean;
}

interface ActivityModalProps {
  toggleModal: (event?: React.MouseEvent) => void;
  activityId: string;
  getAllActivities: () => Promise<void>;
}

const ActivityModal: FunctionComponent<ActivityModalProps> = props => {
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [modalLoading, setModalLoading] = useState<boolean>(true);

  const [activity, setActivity] = useState<ActivityFormValue>(initialActivityState);
  const [originalActivity, setOriginalActivity] = useState<ActivityFormValue>(
    initialActivityState
  );
  const [isNew, setIsNew] = useState<boolean>(props.activityId === "");

  useEffect(() => {
    if (!isNew) {
      // noinspection JSIgnoredPromiseFromCall
      _getActivityById();
    }
  }, []);

  const _getActivityById = async (): Promise<void> => {
    const { activityId } = props;
    const activityData: Activity = await getActivityById(activityId);
    setModalLoading(false);
    setActivity({
      id: activityData.id,
      valid: true,
      name: {
        valid: true,
        validationMessage: "",
        value: activityData.name
      }
    });
    setOriginalActivity({
      id: activityData.id,
      valid: true,
      name: {
        valid: true,
        validationMessage: "",
        value: activityData.name
      }
    });
  };

  const onFormChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setActivity({
      ...activity,
      [event.target.name]: {
        valid: true,
        validationMessage: "",
        value: event.target.value
      }
    });
  };

  const updateActivityNameOnCompanies = (
    companiesList: Company[],
    activityId: string,
    newActivityName: string
  ): Company[] => {
    companiesList.forEach(company => {
      company.activities!.forEach(activity =>
        activity.value === activityId
          ? (activity.label = newActivityName)
          : null
      );
    });
    return companiesList;
  };

  const onUpdateActivity = async (): Promise<void> => {
    const companies = await getCompaniesByActivityId(activity.id);
    const updatedCompaniesList = updateActivityNameOnCompanies(
      companies,
      activity.id,
      activity.name.value
    );
    await updateCompanies(updatedCompaniesList);
    await updateActivity({ id: activity.id, name: activity.name.value });
    await updateTimeReportByActivityId(activity.id, activity.name.value);
    setOriginalActivity(activity);
  };

  const onCreateActivity = async (): Promise<void> => {
    const activityId: string = await createActivity({
      id: activity.id,
      name: activity.name.value
    });
    toast.success(`Successfully created ${activity.name.value}!`);
    setActivity({ ...activity, id: activityId });
    setOriginalActivity({ ...activity, id: activityId });
    setIsNew(false);
    setModalLoading(false);
  };

  const onSubmit = async (): Promise<void> => {
    const validatedForm: ActivityFormValue = {
      ...validateActivityForm(activity)
    };
    if (!validatedForm.valid) {
      console.log(validatedForm);
      setActivity(validatedForm);
      return;
    }
    setLoading(true);
    if (isNew) {
      await onCreateActivity();
    } else {
      await onUpdateActivity();
    }
    // noinspection JSIgnoredPromiseFromCall
    props.getAllActivities();
    setLoading(false);
  };

  const removeActivityFromCompaniesList = (
    companiesList: Company[],
    activityId: string
  ): Company[] => {
    let updatedCompaniesList: Company[] = [];
    companiesList.forEach(company => {
      company.activities = company.activities!.filter(
        activity => activity.value !== activityId
      );
      updatedCompaniesList.push(company);
    });
    return updatedCompaniesList;
  };

  const onDeleteActivity = async (): Promise<void> => {
    setDeleteLoading(true);
    const companies: Company[] = await getCompaniesByActivityId(activity.id);
    const updatedCompaniesList = removeActivityFromCompaniesList(
      companies,
      activity.id
    );
    await updateCompanies(updatedCompaniesList);
    await deleteActivity(activity.id);
    toast.success(`Successfully deleted ${activity.name.value}.`);
    props.toggleModal();
    // noinspection JSIgnoredPromiseFromCall
    props.getAllActivities();
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
              {isNew ? "Create new activity" : originalActivity.name.value}
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
            <ActivityForm form={activity} onFormChange={onFormChange} />
            <ButtonRow isNew={isNew}>
              {!isNew && (
                <Button
                  type="button"
                  text="Delete"
                  onSubmit={onDeleteActivity}
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

export default ActivityModal;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: ${(props: ButtonRowProps) =>
    props.isNew ? "flex-end" : "space-between"};
  width: 100%;
`;
