import React, {FunctionComponent} from 'react';
import styled from "styled-components";

export interface IconProps {
  color: string;
  background?: boolean;
  backgroundColor?: string;
  onClick?: (event: React.MouseEvent) => void;
  margin?: string;
}

interface SvgProps {
  backgroundColor?: string;
  onClick?: (event: React.MouseEvent) => void;
  margin?: string;
  height: string;
  width: string;
}

const CloseIcon: FunctionComponent<SvgProps & IconProps> = props => {
  return (
    <Svg margin={props.margin} onClick={props.onClick} backgroundColor={props.backgroundColor}
         xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} fill={props.color}
         viewBox="0 0 24 24">
      <path onClick={props.onClick} fill="none" d="M0 0h24v24H0V0z"/>
      <path onClick={props.onClick}
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
    </Svg>
  )
};

export default CloseIcon;

const Svg = styled.svg`
  background: ${(props: SvgProps) => props.backgroundColor};
  padding: 5px;
  margin: ${(props: SvgProps) => props.margin};
  border-radius: 3px;
  cursor: pointer;
`;