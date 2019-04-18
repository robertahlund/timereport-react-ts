import React, {FunctionComponent} from 'react';
import styled from "styled-components";

export interface IconProps {
  color: string;
  background?: boolean;
  backgroundColor?: string;
  toggleModal: (event: React.MouseEvent) => void;
}

interface SvgProps {
    backgroundColor?: string;
    toggleModal?: (event: React.MouseEvent) => void;
}

const Svg = styled.svg`
  background: ${(props: SvgProps) => props.backgroundColor};
  padding: 5px;
  margin: 20px 20px 0 0;
  border-radius: 3px;
  cursor: pointer;
`;

const CloseIcon: FunctionComponent<SvgProps & IconProps> = props => {
  return (
    <Svg onClick={props.toggleModal} backgroundColor={props.backgroundColor} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill={props.color} viewBox="0 0 24 24">
      <path onClick={props.toggleModal} fill="none" d="M0 0h24v24H0V0z"/>
      <path onClick={props.toggleModal}
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
    </Svg>
  )
};

export default CloseIcon;