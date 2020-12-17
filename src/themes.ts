import { createMuiTheme } from "@material-ui/core/styles";

const isDarkMatch = window.matchMedia("(prefers-color-scheme: dark)");

export default createMuiTheme({
  palette: {
    primary: {
      main: "#90CAF9"
    },
    secondary: {
      main: "#F48FB1"
    },
    type: isDarkMatch.matches ? "dark" : "light"
  }
});
