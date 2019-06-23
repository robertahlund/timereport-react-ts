import React, {FunctionComponent} from 'react';
import styled from "styled-components";

interface ArrowRightProps {
  width: string;
  height: string;
  color?: string;
}

const ArrowRightIcon: FunctionComponent<ArrowRightProps> = props => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 24 24"
         fill={props.color}>
      <path fill="none" d="M0 0h24v24H0V0z"/>
      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
    </Svg>
  )
};

export default ArrowRightIcon;

const Svg = styled.svg`
  height: ${(props: ArrowRightProps) => props.height};
  width: ${(props: ArrowRightProps) => props.width};
`;