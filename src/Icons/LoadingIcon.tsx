import React, {FunctionComponent} from 'react';
import styled from "styled-components";

interface LoadingIconProps {
  position?: 'absolute' | 'relative';
  left?: string;
  height: string;
  width: string;
  color?: string;
}

const Svg = styled.svg`
  padding: 0 5px 0 0;
  cursor: pointer;
  position: ${(props: LoadingIconProps) => props.position};
  left: ${(props: LoadingIconProps) => props.left};
`;

const LoadingIcon: FunctionComponent<LoadingIconProps> = props => {
  return (
    <Svg
      position={props.position}
      left={props.left}
      x="0px" y="0px"
      width={props.width} height={props.height} viewBox="0 0 24 30" xmlSpace="preserve">
      <rect x="0" y="10" width="4" height="10" fill={props.color} opacity="0.2">
        <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s"
                 repeatCount="indefinite"/>
        <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s"
                 repeatCount="indefinite"/>
        <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s"
                 repeatCount="indefinite"/>
      </rect>
      <rect x="8" y="10" width="4" height="10" fill={props.color} opacity="0.2">
        <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s"
                 repeatCount="indefinite"/>
        <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s"
                 repeatCount="indefinite"/>
        <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s"
                 repeatCount="indefinite"/>
      </rect>
      <rect x="16" y="10" width="4" height="10" fill={props.color} opacity="0.2">
        <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s"
                 repeatCount="indefinite"/>
        <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s"
                 repeatCount="indefinite"/>
        <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s"
                 repeatCount="indefinite"/>
      </rect>
    </Svg>

  )
};

export default LoadingIcon;