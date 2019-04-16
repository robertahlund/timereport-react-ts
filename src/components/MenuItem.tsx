import React, { FunctionComponent } from "react";
import styled from "styled-components";

interface MenuItemProps {
    text: string
}

export const MenuItem: FunctionComponent<MenuItemProps> = props => {
    return <li>{props.text}</li>;
};
