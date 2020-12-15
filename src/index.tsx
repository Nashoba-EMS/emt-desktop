import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { Provider } from "react-redux";

import themes from "./themes";
import reportWebVitals from "./reportWebVitals";
import CssBaseline from "./CssBaseline";
import store from "./redux";
import App from "./App";

ReactDOM.render(
  <MuiThemeProvider theme={themes}>
    <CssBaseline />
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
