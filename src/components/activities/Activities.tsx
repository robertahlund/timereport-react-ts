import React, { Fragment, useState } from "react";
import ActivitiesList from "./ActivitiesList";
import { ContentSection } from "../employees/Employees";
import ActivityModal from "./ActivityModal";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

export interface Activity {
  id: string;
  name: string;
}

const Activities = () => {
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityId, setActivityId] = useState("");

  const toggleActivityModal = (event?: React.MouseEvent): void => {
    if (event) {
      const { target, currentTarget } = event;
      if (target === currentTarget) {
        setShowActivityModal(!showActivityModal);
      }
    } else setShowActivityModal(!showActivityModal);
  };

  const selectActivity = (companyId: string): void => {
    setActivityId(companyId);
    toggleActivityModal();
  };

  return (
    <Fragment>
      <ContentSection>
        <ActivitiesList selectActivity={selectActivity} />
      </ContentSection>
      <ReactCSSTransitionGroup
        transitionName="modal-transition"
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}
      >
        {showActivityModal && (
          <ActivityModal
          activityId={activityId}
          toggleModal={toggleActivityModal}
          />
        )}
      </ReactCSSTransitionGroup>
    </Fragment>
  );
};

export default Activities;