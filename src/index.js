import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AdminAuthContextProvider } from "./context/AdminAuthContext";
import { AdminDataContextProvider } from "./context/AdminDataContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AdminAuthContextProvider>
      <AdminDataContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AdminDataContextProvider>
    </AdminAuthContextProvider>
  </React.StrictMode>
);
