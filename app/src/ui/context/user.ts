import { IClientUser } from "@framework/types/IUser";
import { createContext, useContext } from "react";

const userContext = createContext<IClientUser>({
  email: "",
  projectId: "" as ProjectId,
  csrf: "",
  userSwitcherSearchQuery: "",
  roleInfo: {},
});

export const UserProvider = userContext.Provider;
export const useUserContext = () => useContext(userContext);
