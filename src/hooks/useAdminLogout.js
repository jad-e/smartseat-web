import { useAdminAuthContext } from "./useAdminAuthContext";
// import { useWorkoutsContext } from "./useWorkoutsContext";

export const useAdminLogout = () => {
  const { dispatch } = useAdminAuthContext();
  //   const { dispatch: workoutsDispatch } = useWorkoutsContext();

  const logout = () => {
    //remove admin user from local storage
    localStorage.removeItem("adminUser");

    //dispatch logout action
    dispatch({ type: "LOGOUT" });

    //clear the global workout state when logging out
    //prevent flash
    //workoutsDispatch({ type: "SET_WORKOUTS", payload: null });
  };

  return { logout };
};
