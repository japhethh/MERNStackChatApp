import { createContext, ReactNode } from "react";

export const UserContext = createContext<UserContextValue | null>(null)

interface UserContextValue {
  apiURL: string;
}

interface Props {
  children: ReactNode;
}

const UserContextProvider = ({ children }: Props) => {
  const apiURL = "https://mernstackchatapp-api.onrender.com";

  const contextValue: UserContextValue = {
    apiURL,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;