import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { installGlobalHandlers } from "@shared/monitoring/install-global-handlers";

// Styles DSFR
import "@gouvfr/dsfr/dist/dsfr.min.css";
import "@gouvfr/dsfr/dist/utility/utility.min.css";

// Scripts DSFR
import "@gouvfr/dsfr/dist/dsfr.module.min.js";

// Styles custom (Tailwind)
import "../styles/index.css";

// Capture des erreurs JS non gérées (window.error + unhandledrejection).
installGlobalHandlers();

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  );
} else {
  console.error("L'élément root n'a pas été trouvé dans le DOM");
}
