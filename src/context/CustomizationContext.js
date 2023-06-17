import { createContext, useReducer } from "react";

export const CustomizationContext = createContext(); //creates a context

export const customizationReducer = (state, action) => {
  switch (action.type) {
    case "SET_CUSTOMIZATIONS":
      return { customization: action.payload };

    case "CREATE_CUSTOMIZATION":
      return {
        customization: [...state.customization, action.payload],
      };

    case "DELETE_CUSTOMIZATION":
      return { customization: action.payload };

    case "EDIT_CUSTOMIZATION":
      return { customization: action.payload };

    default:
      return state;
  }
};

export const CustomizationContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(customizationReducer, {
    customization: null,
  });

  return (
    <CustomizationContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CustomizationContext.Provider>
  );
};
