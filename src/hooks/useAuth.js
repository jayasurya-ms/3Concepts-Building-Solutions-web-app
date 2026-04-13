import { useContext } from "react";
import { ContextPanel } from "../lib/ContextPanel";

const useAuth = () => {
  const context = useContext(ContextPanel);
  
  if (!context) {
    throw new Error("useAuth must be used within an AppProvider");
  }

  // Map context values to the expected hook return signature
  return {
    user: context.user,
    token: context.token,
    userUrls: context.userUrls,
    isLoading: context.loading,
    login: context.login,
    logout: context.logout
  };
};

export default useAuth;
