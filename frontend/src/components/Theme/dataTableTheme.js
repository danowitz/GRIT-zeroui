import { createTheme } from "react-data-table-component";

// Keep the historical theme name because table call sites use it, while the
// values now match the light GRIT Cloud shell.
createTheme("grit-dark", {
  text: {
    primary: "#242424",
    secondary: "#66717c",
    disabled: "rgba(36,36,36,0.35)",
  },
  background: { default: "transparent" },
  context: { background: "#ef5b36", text: "#ffffff" },
  divider: { default: "#d9dde1" },
  button: {
    default: "#4f5963",
    focus: "rgba(239,91,54,0.2)",
    hover: "rgba(239,91,54,0.1)",
    disabled: "rgba(36,36,36,0.2)",
  },
  highlightOnHover: { default: "#fff3ee", text: "#242424" },
  striped: { default: "#f7f6f2", text: "#242424" },
});
