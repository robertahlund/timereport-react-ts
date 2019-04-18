import React, { ReactNode, FunctionComponent, Fragment } from "react";
import {WeekDay} from "./WeekDay";

interface WeekRowProps {
    children: ReactNode[] | ReactNode;
}

export const WeekRow: FunctionComponent<WeekRowProps> = props => {
    return (
        <Fragment>
            <WeekDay/>
        </Fragment>
    );
};
