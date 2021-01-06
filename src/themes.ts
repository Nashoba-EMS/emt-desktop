import { createMuiTheme } from "@material-ui/core/styles";

const envTheme = process.env.REACT_APP_THEME ?? "auto";

export const isDarkMatch =
  envTheme === "auto"
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : {
        matches: envTheme === "dark"
      };

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
