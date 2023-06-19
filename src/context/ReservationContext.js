import { createContext, useReducer } from "react";

export const ReservationContext = createContext(); //creates a context

export const reservationReducer = (state, action) => {
  switch (action.type) {
    case "SET_RESERVATIONS":
      return { reservation: action.payload };

    case "CREATE_RESERVATION":
      return {
        reservation: [...state.reservation, action.payload],
      };

    case "DELETE_RESERVATION":
      return { reservation: action.payload };

    case "EDIT_RESERVATION":
      return { reservation: action.payload };

    default:
      return state;
  }
};

export const ReservationContextProvider = ({ children }) => {
  const [state, dispatchR] = useReducer(reservationReducer, {
    reservation: null,
  });

  return (
    <ReservationContext.Provider value={{ ...state, dispatchR }}>
      {children}
    </ReservationContext.Provider>
  );
};
