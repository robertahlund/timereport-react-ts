import React, {FunctionComponent} from "react";

interface MenuItemProps {
  text: string;
  signOut?: () => Promise<void>;
  toggleModal?: (event: React.MouseEvent) => void;
}

export const MenuItem: FunctionComponent<MenuItemProps> = props => {
  return <li onClick={props.signOut || props.toggleModal}>{props.text}</li>;
};
