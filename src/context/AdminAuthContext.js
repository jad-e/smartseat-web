import { createContext, useReducer, useEffect } from "react";

export const AdminAuthContext = createContext();

export const adminAuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { adminUser: action.payload };
    case "LOGOUT":
      return { adminUser: null };
    default:
      return state;
  }
};

export const AdminAuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminAuthReducer, {
    adminUser: null,
  });

  //check if admin user is already logged in from last time
  useEffect(() => {
    const adminUser = JSON.parse(localStorage.getItem("adminUser"));

    if (adminUser) {
      dispatch({ type: "LOGIN", payload: adminUser });
    }
  }, []); //only fires once when the components first renders)

  console.log("AdminAuthContext state: ", state); //everytime the state (admin user login state) changes, this will be logged

  return (
    <AdminAuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
