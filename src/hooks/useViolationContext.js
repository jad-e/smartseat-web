import { ViolationContext } from "../context/ViolationContext";
import { useContext } from "react";

export const useViolationContext = () => {
  const context = useContext(ViolationContext);

  if (!context) {
    throw Error(
      "useViolationContext must be used inside an ViolationContextProvider"
    );
  }

  return context;
};
