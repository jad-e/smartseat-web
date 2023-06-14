import { createContext, useReducer } from "react";

export const AdminDataContext = createContext(); //creates a context

export const adminDataReducer = (state, action) => {
  switch (action.type) {
    case "SET_ADMINS":
      return { adminData: action.payload };

    case "CREATE_ADMIN":
      return {
        adminData: [...state.adminData, action.payload],
      };

    case "DELETE_ADMIN":
      return { adminData: action.payload };

    case "EDIT_ADMIN":
      return { adminData: action.payload };

    default:
      return state;
  }
};

export const AdminDataContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminDataReducer, {
    adminData: null,
  });

  return (
    <AdminDataContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AdminDataContext.Provider>
  );
};
