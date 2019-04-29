import React from 'react';
import styled from "styled-components";

const DateSelectorWrapper = styled.div`
  align-self: flex-end;
`;

const DateSelector = () => {
  return (
    <DateSelectorWrapper>
      <span>DateSelector</span>
    </DateSelectorWrapper>
  );
};

export default DateSelector;