import { StudentDataContext } from "../context/StudentDataContext";
import { useContext } from "react";

export const useStudentDataContext = () => {
  const context = useContext(StudentDataContext);

  if (!context) {
    throw Error(
      "useStudentDataContext must be used inside an StudentDataContextProvider"
    );
  }

  return context;
};
