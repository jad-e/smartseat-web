import { AdminDataContext } from "../context/AdminDataContext";
import { useContext } from "react";

export const useAdminDataContext = () => {
  const context = useContext(AdminDataContext);

  if (!context) {
    throw Error(
      "useAdminDataContext must be used inside an AdminDataContextProvider"
    );
  }

  return context;
};
