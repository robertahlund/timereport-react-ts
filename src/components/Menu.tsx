import { MenuItem } from "./MenuItem";
import React, { ReactNode, FunctionComponent, Fragment } from "react";

interface Props {
  children: ReactNode[] | ReactNode;
  title: string;
};

export const Menu: FunctionComponent<Props> = props => {
  return (
    <Fragment>
        <p>{props.title}</p>
      <div>{props.children}</div>
    </Fragment>
  );
};
