import { createContext } from "react";
import type { IAuthContextData } from "../../types/auth";

export const AuthContext = createContext({} as IAuthContextData);
