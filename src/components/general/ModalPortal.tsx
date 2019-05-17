import React, {FunctionComponent, ReactNode} from "react";
import ReactDOM from "react-dom";
import {modalAnimation, modalPortal} from "../../constants/generalConstants";
import {useSpring, animated} from "react-spring";

interface ModalPortalProps {
  children: ReactNode
}

const ModalPortal: FunctionComponent<ModalPortalProps> = ({children}) => {
  if (modalPortal) {
    const animation = useSpring(modalAnimation);
    return (
      ReactDOM.createPortal(
        <animated.div style={animation}>
          {children}
        </animated.div>
        , modalPortal)
    )
  } else {
    return null;
  }
};

export default ModalPortal;