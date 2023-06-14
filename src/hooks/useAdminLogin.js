import { useState } from "react";
import { useAdminAuthContext } from "./useAdminAuthContext";

export const useAdminLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const { dispatch } = useAdminAuthContext();

  const login = async (username, password) => {
    //reset the value everytime make a login request
    setIsLoading(true);
    setError(null);

    const response = await fetch("/api/adminUser/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const json = await response.json();

    //if there is a problem
    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }

    if (response.ok) {
      //save the admin user (username and json web token) to local storage
      localStorage.setItem("adminUser", JSON.stringify(json));

      //update the admin auth context
      dispatch({ type: "LOGIN", payload: json });

      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
