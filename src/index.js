import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AdminAuthContextProvider } from "./context/AdminAuthContext";
import { AdminDataContextProvider } from "./context/AdminDataContext";
import { StudentDataContextProvider } from "./context/StudentDataContext";
import { CustomizationContextProvider } from "./context/CustomizationContext";
import { ViolationContextProvider } from "./context/ViolationContext";
import { ReservationContextProvider } from "./context/ReservationContext";
import { AssistanceRequestContextProvider } from "./context/AssistanceRequestContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AdminAuthContextProvider>
      <AdminDataContextProvider>
        <StudentDataContextProvider>
          <CustomizationContextProvider>
            <ReservationContextProvider>
              <ViolationContextProvider>
                <AssistanceRequestContextProvider>
                  <BrowserRouter>
                    <App />
                  </BrowserRouter>
                </AssistanceRequestContextProvider>
              </ViolationContextProvider>
            </ReservationContextProvider>
          </CustomizationContextProvider>
        </StudentDataContextProvider>
      </AdminDataContextProvider>
    </AdminAuthContextProvider>
  </React.StrictMode>
);
