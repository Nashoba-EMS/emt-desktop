import { createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import orange from "@material-ui/core/colors/orange";

// Color theme taken from:
// https://www.creativeservices.illinois.edu/brand/logos-and-colors.html
const isDarkMatch = window.matchMedia("(prefers-color-scheme: dark)");

export default createMuiTheme({
  palette: {
    primary: blue,
    secondary: orange,
    type: isDarkMatch.matches ? "dark" : "light"
  }
});
