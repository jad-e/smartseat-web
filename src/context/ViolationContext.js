import { createContext, useReducer } from "react";

export const ViolationContext = createContext(); //creates a context

export const violationReducer = (state, action) => {
  switch (action.type) {
    case "SET_VIOLATIONS":
      return { violation: action.payload };

    case "CREATE_VIOLATION":
      return {
        violation: [...state.violation, action.payload],
      };

    case "DELETE_VIOLATION":
      return { violation: action.payload };

    case "EDIT_VIOLATION":
      return { violation: action.payload };

    default:
      return state;
  }
};

export const ViolationContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(violationReducer, {
    violation: null,
  });

  return (
    <ViolationContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ViolationContext.Provider>
  );
};
