import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { APP_ROOT_ELEMENT_ID } from "./constants/AppRootElementId";

const rootElement = document.getElementById(APP_ROOT_ELEMENT_ID)!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
