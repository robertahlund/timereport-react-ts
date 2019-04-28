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
import { Activity } from "./Activities";
import ActivityForm from "./ActivityForm";
import { toast } from "react-toastify";

interface ActivityModalProps {
  toggleModal: (event: React.MouseEvent) => void;
  activityId: string;
}

const ActivityModal: FunctionComponent<ActivityModalProps> = props => {
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(true);
  const initialActivityState: Activity = {
    id: "",
    name: ""
  };
  const [activity, setActivity] = useState(initialActivityState);
  const [isNew, setIsNew] = useState(props.activityId === "");

  const getActivityById = async (): Promise<void> => {
    const { activityId } = props;
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

  const updateActivity = async (): Promise<void> => {
    try {
      const db = firebase.firestore();
      db
        .collection("activities")
        .doc(activity.id)
        .update(activity)
        .then(() => {
          toast.success(`Successfully updated ${activity.name}`);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const createActivity = async (): Promise<void> => {
    if (activity.name === "") {
      return;
    }
    try {
      setLoading(true);
      const db = firebase.firestore();
      db
        .collection("activities")
        .add(activity)
        .then(document => {
          db
            .collection("activities")
            .doc(document.id)
            .update({ ...activity, id: document.id })
            .then(() => {
              setActivity({...activity, id: document.id});
              toast.success(`Successfully created ${activity.name}`);
            });
          setIsNew(false);
          setModalLoading(false);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (): Promise<void> => {
    if (isNew) {
      // noinspection JSIgnoredPromiseFromCall
      createActivity();
    } else {
      // noinspection JSIgnoredPromiseFromCall
      updateActivity();
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
              {isNew ? "Create new activity" : activity.name}
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
            <Button
              type="button"
              text={isNew ? "Create" : "Update"}
              loading={loading}
              onSubmit={onSubmit}
            />
          </Section>
        </ModalContent>
      )}
    </ModalBackground>
  );
};

export default ActivityModal;
