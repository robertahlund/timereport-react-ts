import React, {FunctionComponent, Fragment, ChangeEvent} from 'react';
import {Label} from "./Input";
import styled from "styled-components";
import CheckIcon from "../../icons/CheckIcon";
import _ from "lodash";

interface CheckboxStyleProps {
  checked: boolean;
}

interface CheckboxContainerProps {
  paddingTop: string;
}

interface CheckboxProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  id: string;
  labelValue: string;
  paddingTop: string;
  uid?: string;
  currentUserUid?: string;
}

const Checkbox: FunctionComponent<CheckboxProps> = props => {
  return (
    <CheckboxContainer paddingTop={props.paddingTop}>
      <CheckboxLabel htmlFor={props.id}>
        <HiddenCheckbox type="checkbox"
                        disabled={props.uid === props.currentUserUid && !_.isNil(props.uid) && !_.isNil(props.currentUserUid)} {...props}/>
        <StyledCheckbox checked={props.checked}><CheckIcon width="16px" height="16px"/></StyledCheckbox>
        <span>{props.labelValue}</span>
      </CheckboxLabel>
    </CheckboxContainer>
  )
};

export default Checkbox;

const HiddenCheckbox = styled.input.attrs({type: 'checkbox'})`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledCheckbox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: ${(props: CheckboxStyleProps) => props.checked ? '#FEC861' : '#fbfbfb'}
  border-radius: 3px;
  transition: all 150ms;
  margin-right: 10px;
  border: ${(props: CheckboxStyleProps) => props.checked ? '1px solid #FEC861' : '1px solid #f1f1f1'}
  box-sizing: border-box;
  svg {
    visibility: ${(props: CheckboxStyleProps) => props.checked ? 'visible' : 'hidden'}
  }
`;

const CheckboxLabel = styled(Label)`
  display: flex;
  align-items: center;
`;

const CheckboxContainer = styled.div`
  padding-top: ${(props: CheckboxContainerProps) => props.paddingTop}
`;