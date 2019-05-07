import React, {FunctionComponent, ReactNode} from "react";
import ReactDOM from "react-dom";
import {modalPortal} from "../../constants/generalConstants";

interface ModalPortalProps {
  children: ReactNode
}

const ModalPortal: FunctionComponent<ModalPortalProps> = (props) => {
  if (modalPortal) {
    return (
      ReactDOM.createPortal(props.children, modalPortal)
    )
  } else {
    return null;
  }
};

export default ModalPortal;