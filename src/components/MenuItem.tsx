import React, {FunctionComponent} from "react";

interface MenuItemProps {
  text: string;
  signOut?: () => Promise<void>;
}

export const MenuItem: FunctionComponent<MenuItemProps> = props => {
  return <li onClick={props.signOut}>{props.text}</li>;
};
