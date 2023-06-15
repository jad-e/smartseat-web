import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AdminAuthContextProvider } from "./context/AdminAuthContext";
import { AdminDataContextProvider } from "./context/AdminDataContext";
import { StudentDataContextProvider } from "./context/StudentDataContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AdminAuthContextProvider>
      <AdminDataContextProvider>
        <StudentDataContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </StudentDataContextProvider>
      </AdminDataContextProvider>
    </AdminAuthContextProvider>
  </React.StrictMode>
);
