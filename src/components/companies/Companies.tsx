import React, {Fragment, useState} from 'react';
import {ContentSection} from "../employees/Employees";
import CompanyList from "./CompanyList";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import CompanyModal from "./CompanyModal";

const Companies = () => {
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [companyId, setCompanyId] = useState("");

  const toggleCompanyModal = (event?: React.MouseEvent): void => {
    if (event) {
      const {target, currentTarget} = event;
      if (target === currentTarget) {
        setShowCompanyModal(!showCompanyModal);
      }
    } else setShowCompanyModal(!showCompanyModal);
  };

  const selectCompany = (companyId: string): void => {
    setCompanyId(companyId);
    toggleCompanyModal()
  };

  return (
    <Fragment>
      <ContentSection>
        <CompanyList selectCompany={selectCompany}/>
      </ContentSection>
      <ReactCSSTransitionGroup
        transitionName="modal-transition"
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}
      >
        {showCompanyModal && <CompanyModal companyId={companyId} toggleModal={toggleCompanyModal}/>}
      </ReactCSSTransitionGroup>
    </Fragment>
  );
};

export default Companies;