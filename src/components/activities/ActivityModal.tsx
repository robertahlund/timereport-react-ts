import React, {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useState
} from "react";
import CloseIcon from "../../Icons/CloseIcon";
import Button from "../general/Button";
import {
  ModalBackground,
  ModalContent,
  ModalHeader,
  ModalTitle,
  Section
} from "../account/MyAccountModal";
import firebase from "../../firebaseConfig";
import LoadingIcon from "../../Icons/LoadingIcon";
import ActivityForm from "./ActivityForm";
import {toast} from "react-toastify";
import styled from "styled-components";
import {AuthObject} from "../../App";
import {Company} from "../companies/CompanyList";
import {deleteActivity, updateActivity} from "../../api/activityApi";
import {getCompaniesByActivityId, updateCompanies} from "../../api/companyApi";
import {Activity} from "../../types/activityTypes";

export const ButtonRow = styled.div`
  display: flex;
  justify-content: ${(props: ButtonRowProps) => props.isNew ? "flex-end" : "space-between"};
  width: 100%;
`;

export interface ButtonRowProps {
  isNew: boolean;
}

interface ActivityModalProps {
  toggleModal: (event?: React.MouseEvent) => void;
  activityId: string;
}

const ActivityModal: FunctionComponent<ActivityModalProps> = props => {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(true);
  const initialActivityState: Activity = {
    id: "",
    name: ""
  };
  const [activity, setActivity] = useState(initialActivityState);
  const [originalActivity, setOriginalActivity] = useState(initialActivityState);
  const [isNew, setIsNew] = useState(props.activityId === "");

  const getActivityById = async (): Promise<void> => {
    const {activityId} = props;
    const db = firebase.firestore();
    await db
      .collection("activities")
      .doc(activityId)
      .get()
      .then(doc => {
        if (doc.exists) {
          // @ts-ignore
          const activityData: Activity = doc.data();
          setModalLoading(false);
          setActivity(activityData);
          setOriginalActivity(activityData)
        }
        console.log(doc.data());
      });
  };

  useEffect(() => {
    if (!isNew) {
      // noinspection JSIgnoredPromiseFromCall
      getActivityById();
    }
  }, []);

  const onFormChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setActivity({
      ...activity,
      [event.target.name]: event.target.value
    });
  };

  const updateActivityNameOnCompanies = (companiesList: Company[], activityId: string, newActivityName: string): Company[] => {
    companiesList.forEach(company => {
      company.activities!.forEach(activity => activity.value === activityId ? activity.label = newActivityName : null)
    });
    return companiesList;
  };

  const onUpdateActivity = async (): Promise<void> => {
    try {
      const companies = await getCompaniesByActivityId(activity.id);
      if (typeof companies !== "string") {
        const updatedCompaniesList = updateActivityNameOnCompanies(companies, activity.id, activity.name);
        await updateCompanies(updatedCompaniesList);
        await updateActivity(activity);
        setOriginalActivity(activity);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onCreateActivity = async (): Promise<void> => {
    if (activity.name === "") {
      return;
    }
    try {
      const db = firebase.firestore();
      await db
        .collection("activities")
        .add(activity)
        .then(document => {
          db
            .collection("activities")
            .doc(document.id)
            .update({...activity, id: document.id})
            .then(() => {
              setActivity({...activity, id: document.id});
              toast.success(`Successfully created ${activity.name}!`);
            });
        });
      setOriginalActivity(activity);
      setIsNew(false);
      setModalLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (): Promise<void> => {
    setLoading(true);
    if (isNew) {
      await onCreateActivity();
    } else {
      await onUpdateActivity();
    }
    setLoading(false);
  };

  const removeActivityFromCompaniesList = (companiesList: Company[], activityId: string): Company[] => {
    let updatedCompaniesList: Company[] = [];
    companiesList.forEach(company => {
      company.activities = company.activities!.filter(activity => activity.value !== activityId);
      updatedCompaniesList.push(company);
    });
    return updatedCompaniesList;
  };

  const onDeleteActivity = async (): Promise<void> => {
    try {
      setDeleteLoading(true);
      const companies = await getCompaniesByActivityId(activity.id);
      if (typeof companies !== "string") {
        const updatedCompaniesList = removeActivityFromCompaniesList(companies, activity.id);
        await updateCompanies(updatedCompaniesList);
        await deleteActivity(activity.id);
        toast.success(`Successfully deleted ${activity.name}.`);
        props.toggleModal();
      }
    } catch (error) {
      setDeleteLoading(false);
      console.log(error);
    }
  };

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
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {isNew ? "Create new activity" : originalActivity.name}
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
            <ActivityForm form={activity} onFormChange={onFormChange}/>
            <ButtonRow isNew={isNew}>
              {!isNew && <Button type="button" text="Delete" onSubmit={onDeleteActivity} buttonType="Delete"
                                 loading={deleteLoading}/>}
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
