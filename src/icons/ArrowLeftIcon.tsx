import React, {FunctionComponent} from 'react';
import styled from "styled-components";

interface ArrowLeftProps {
  width: string;
  height: string;
  color?: string;
}

const ArrowLeftIcon: FunctionComponent<ArrowLeftProps> = props => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 24 24"
         fill={props.color}>
      <path fill="none" d="M0 0h24v24H0V0z"/>
      <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
    </Svg>
  )
};

export default ArrowLeftIcon;

const Svg = styled.svg`
  height: ${(props: ArrowLeftProps) => props.height};
  width: ${(props: ArrowLeftProps) => props.width};
`;