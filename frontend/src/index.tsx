import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";

import "./styles/reset.css";
import "./styles/index.css";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import React from "react";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
