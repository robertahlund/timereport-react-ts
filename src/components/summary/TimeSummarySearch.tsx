import React, {ChangeEvent, FunctionComponent} from 'react';
import Input from "../general/Input";
import {PaddingRow} from "../authentication/LoginForm";

interface TimeSummarySearchProps {
  searchValue: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const TimeSummarySearch: FunctionComponent<TimeSummarySearchProps> = props => {
  const {searchValue, onSearchChange} = props;
  return (
    <PaddingRow>
      <Input
        name="search"
        value={searchValue}
        labelValue="Search"
        type="text"
        onFormChange={onSearchChange}
        width="300px"
      />
    </PaddingRow>
  )
};

export default TimeSummarySearch;