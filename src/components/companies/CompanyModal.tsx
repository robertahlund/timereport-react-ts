import React, {ChangeEvent, FunctionComponent, useEffect, useState} from 'react';
import CloseIcon from "../../Icons/CloseIcon";
import ModalForm from "../account/ModalForm";
import Button from "../general/Button";
import {ModalBackground, ModalContent, ModalHeader, ModalTitle, Section} from "../account/MyAccountModal";
import firebase from "../../firebaseConfig";
import {Company} from "./CompanyList";
import LoadingIcon from "../../Icons/LoadingIcon";
import CompanyForm from "./CompanyForm";

interface CompanyModalProps {
  toggleModal: (event: React.MouseEvent) => void;
  companyId: string;
}

const CompanyModal: FunctionComponent<CompanyModalProps> = props => {
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(true);
  const initialCompanyState: Company = {
    id: "",
    orgNumber: "",
    name: ""
  };
  const [company, setCompany] = useState(initialCompanyState);
  const isNew = props.companyId === "";

  const getCompanyById = async (): Promise<void> => {
    const {companyId} = props;
    const db = firebase.firestore();
    await db.collection("companies")
      .doc(companyId)
      .get()
      .then(doc => {
        if (doc.exists) {
          // @ts-ignore
          const companyData: Company = doc.data();
          setModalLoading(false);
          setCompany(companyData);
        }
        console.log(doc.data())
      })
  };

  useEffect(() => {
    if (!isNew) {
      // noinspection JSIgnoredPromiseFromCall
      getCompanyById();
    }
  }, []);

  const onFormChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setCompany({
      ...company,
      [event.target.name]: event.target.value
    })
  };

  return (
    <ModalBackground onClick={props.toggleModal}>
      {modalLoading && !isNew ? (
        <LoadingIcon position="relative" left="0px" height="100px" width="100px" color="#393e41"/>
      ) : (
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {isNew ? "Create new company" : company.name}
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
            <CompanyForm form={company} onFormChange={onFormChange}/>
            <Button
              type="button"
              text={isNew ? "Create" : "Update"}
              loading={loading}
              onSubmit={() => {
              }}
            />
          </Section>
        </ModalContent>
      )}
    </ModalBackground>
  );
};

export default CompanyModal;