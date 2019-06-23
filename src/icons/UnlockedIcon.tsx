import React, {FunctionComponent} from 'react';
import styled from "styled-components";

interface UnlockedIconProps {
  width: string;
  height: string;
  color?: string;
}

const UnlockedIcon: FunctionComponent<UnlockedIconProps> = props => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 24 24"
         fill={props.color}>
      <g fill="none">
        <path d="M0 0h24v24H0V0z"/>
        <path opacity=".87" d="M0 0h24v24H0V0z"/>
      </g>
      <path
        d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
    </Svg>

  )
};

export default UnlockedIcon;

const Svg = styled.svg`
  height: ${(props: UnlockedIconProps) => props.height};
  width: ${(props: UnlockedIconProps) => props.width};
`;