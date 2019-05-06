import React from "react";
import {AuthObject} from "../../types/types";

export const AuthContext = React.createContext<AuthObject | boolean>(false);
export const AuthContextProvider = AuthContext.Provider;
export const AuthContextConsumer = AuthContext.Consumer;