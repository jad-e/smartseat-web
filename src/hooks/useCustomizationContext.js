import { CustomizationContext } from "../context/CustomizationContext";
import { useContext } from "react";

export const useCustomizationContext = () => {
  const context = useContext(CustomizationContext);

  if (!context) {
    throw Error(
      "useCustomizationContext must be used inside an CustomizationContextProvider"
    );
  }

  return context;
};
