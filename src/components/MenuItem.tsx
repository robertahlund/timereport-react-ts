import React, { FunctionComponent } from "react";

interface MenuItemProps {
    text: string
}

export const MenuItem: FunctionComponent<MenuItemProps> = props => {
    return <li>{props.text}</li>;
};
