import { createTheme } from "react-data-table-component";

// Dark theme for react-data-table-component (the Members, Managed Routes, and
// IPv4 pool tables) so they match the GRIT MUI dark theme instead of the
// library's default light theme. Imported for its side effect (registers the
// "grit-dark" theme name) by components/Theme/Theme.jsx.
createTheme(
  "grit-dark",
  {
    text: {
      primary: "#e6e6e6",
      secondary: "#a8a8a8",
      disabled: "rgba(255,255,255,0.3)",
    },
    // Transparent so the table blends into the dark panel behind it.
    background: { default: "transparent" },
    context: { background: "#15171a", text: "#ffffff" },
    divider: { default: "#33373d" },
    button: {
      default: "#e6e6e6",
      focus: "rgba(255,193,7,0.25)",
      hover: "rgba(255,193,7,0.15)",
      disabled: "rgba(255,255,255,0.2)",
    },
    highlightOnHover: { default: "#2a2f36", text: "#ffffff" },
    striped: { default: "#1b1e23", text: "#e6e6e6" },
  },
  "dark"
);
