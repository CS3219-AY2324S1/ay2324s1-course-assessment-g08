import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.module.css";
import App from "./app";
import * as process from "process";
import { RecoilRoot } from "recoil";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
window.global = window;
window.process = process;
window.Buffer = window.Buffer || [];
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
);
