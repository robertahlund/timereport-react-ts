import React, {useState, Fragment} from 'react';
import styled from "styled-components";
import EmployeeList from "./EmployeeList";
import EmployeeModal from "./EmployeeModal";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

export const ContentSection = styled.section`
  display: flex;
  flex-direction: column;
  margin: 100px auto 0 auto;
  width: 70vw;
  max-width: 1440px;
`;

const Employees = () => {
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [userUid, setUserUid] = useState("");

  const toggleEmployeeModal = (event?: React.MouseEvent): void => {
    if (event) {
      const {target, currentTarget} = event;
      if (target === currentTarget) {
        setShowEmployeeModal(!showEmployeeModal);
      }
    } else setShowEmployeeModal(!showEmployeeModal);
  };

  const selectUser = (uid: string): void => {
    setUserUid(uid);
    toggleEmployeeModal()
  };

  return (
    <Fragment>
      <ContentSection>
        <EmployeeList selectUser={selectUser}/>
      </ContentSection>
      <ReactCSSTransitionGroup
        transitionName="modal-transition"
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}
      >
        {showEmployeeModal && <EmployeeModal uid={userUid} toggleModal={toggleEmployeeModal}/>}
      </ReactCSSTransitionGroup>
    </Fragment>
  );
};

export default Employees;