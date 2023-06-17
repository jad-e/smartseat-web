import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AdminAuthContextProvider } from "./context/AdminAuthContext";
import { AdminDataContextProvider } from "./context/AdminDataContext";
import { StudentDataContextProvider } from "./context/StudentDataContext";
import { CustomizationContextProvider } from "./context/CustomizationContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AdminAuthContextProvider>
      <AdminDataContextProvider>
        <StudentDataContextProvider>
          <CustomizationContextProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </CustomizationContextProvider>
        </StudentDataContextProvider>
      </AdminDataContextProvider>
    </AdminAuthContextProvider>
  </React.StrictMode>
);
