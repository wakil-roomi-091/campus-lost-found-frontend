import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Router should ONLY be here
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
      {/* Only one Router, here in index.js */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

reportWebVitals();
