import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./dataTableTheme";

// Match the light GRIT Cloud shell so the embedded app reads as one surface.
const theme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#ef5b36",
      dark: "#c94425",
    },
    secondary: {
      main: "#1b2025",
    },
    background: {
      default: "#f7f6f2",
      paper: "#ffffff",
    },
    text: {
      primary: "#242424",
      secondary: "#66717c",
    },
  },
  shape: {
    borderRadius: 6,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica Neue", Arial, sans-serif',
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
