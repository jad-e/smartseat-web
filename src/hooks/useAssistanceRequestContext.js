import { AssistanceRequestContext } from "../context/AssistanceRequestContext";
import { useContext } from "react";

export const useAssistanceRequestContext = () => {
  const context = useContext(AssistanceRequestContext);

  if (!context) {
    throw Error(
      "useAssistanceRequestContext must be used inside an AssistanceRequestContextProvider"
    );
  }

  return context;
};
