import { createContext, useReducer } from "react";

export const AssistanceRequestContext = createContext(); //creates a context

export const assistanceRequestReducer = (state, action) => {
  switch (action.type) {
    case "SET_ASSISTANCEREQUESTS":
      return { assistanceRequest: action.payload };

    case "CREATE_ASSISTANCEREQUEST":
      return {
        assistanceRequest: [...state.assistanceRequest, action.payload],
      };

    case "DELETE_ASSISTANCEREQUEST":
      return { assistanceRequest: action.payload };

    case "EDIT_ASSISTANCEREQUEST":
      return { assistanceRequest: action.payload };

    default:
      return state;
  }
};

export const AssistanceRequestContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(assistanceRequestReducer, {
    assistanceRequest: null,
  });

  return (
    <AssistanceRequestContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AssistanceRequestContext.Provider>
  );
};
