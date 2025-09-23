import { useContext } from "react";
import { AuthContext } from "./AuthContext/AuthContext";

export const useAuthContext = () => useContext(AuthContext);

