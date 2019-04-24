import React, {FunctionComponent} from 'react';
import styled from "styled-components";

interface CheckIconProps {
  width: string;
  height: string;
}

const Svg = styled.svg`
  height: ${(props: CheckIconProps) => props.height};
  width: ${(props: CheckIconProps) => props.width};
`;

const CheckIcon: FunctionComponent<CheckIconProps> = props => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0V0z"/>
      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
    </Svg>
  )
};

export default CheckIcon;