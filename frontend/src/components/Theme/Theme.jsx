import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { red, amber } from "@material-ui/core/colors";
import "./dataTableTheme"; // registers the "grit-dark" react-data-table-component theme

// GRIT dark theme: dark surfaces with the existing amber/orange accent.
// CssBaseline propagates background.default to <body> so the whole UI (and the
// embedded iframe in the GRIT cloud app) renders dark.
const theme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: amber[500],
    },
    secondary: {
      main: red[500],
    },
    background: {
      default: "#15171a",
      paper: "#1e2227",
    },
  },
});

function Theme({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default Theme;
