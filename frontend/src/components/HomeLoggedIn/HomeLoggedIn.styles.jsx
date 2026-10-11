import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 1180,
    margin: "0 auto",
    padding: theme.spacing(6, 4, 8),
    "html.grit-embedded &": {
      maxWidth: "none",
      margin: 0,
      padding: 0,
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(3, 2, 5),
    },
  },
  hero: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing(3),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      marginBottom: theme.spacing(3),
    },
  },
  title: {
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.75),
  },
  controllerAddress: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    color: theme.palette.text.secondary,
    fontSize: "0.8125rem",
    marginTop: theme.spacing(2),
    "& strong": {
      color: theme.palette.text.primary,
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
      background: "rgba(255, 255, 255, 0.07)",
      borderRadius: 6,
      padding: theme.spacing(0.5, 1),
    },
  },
  createBtn: {
    flexShrink: 0,
    minHeight: 42,
    borderRadius: 8,
    fontWeight: 700,
    textTransform: "none",
    boxShadow: "none",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  networkSection: {
    background: theme.palette.background.paper,
    border: "1px solid #dfe2e5",
    borderRadius: 12,
    padding: theme.spacing(3),
    boxShadow: "0 8px 28px rgba(30, 38, 45, 0.08)",
    [theme.breakpoints.down("xs")]: {
      margin: theme.spacing(0, -1),
      padding: theme.spacing(2),
      borderRadius: 10,
    },
  },
  listToolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(2.5),
    borderBottom: "1px solid #e5e7e9",
    [theme.breakpoints.down("sm")]: {
      alignItems: "stretch",
      flexDirection: "column",
    },
  },
  resultCount: {
    color: theme.palette.text.secondary,
    fontSize: "0.8125rem",
    marginTop: theme.spacing(0.25),
  },
  listControls: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.5),
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    [theme.breakpoints.down("xs")]: {
      alignItems: "stretch",
      flexDirection: "column",
    },
  },
  search: {
    width: 360,
    maxWidth: "100%",
    "& .MuiOutlinedInput-root": {
      borderRadius: 8,
      background: "#ffffff",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  sort: {
    width: 190,
    flexShrink: 0,
    "& .MuiOutlinedInput-root": {
      borderRadius: 8,
      background: "#ffffff",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  refreshHubIps: {
    minHeight: 40,
    flexShrink: 0,
    borderRadius: 8,
    fontWeight: 600,
    textTransform: "none",
    whiteSpace: "nowrap",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  networkList: {
    display: "grid",
    gap: theme.spacing(1.25),
    marginTop: theme.spacing(2.5),
  },
  emptyState: {
    minHeight: 220,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(0.75),
    color: theme.palette.text.secondary,
    textAlign: "center",
    padding: theme.spacing(4, 2),
  },
  emptyIcon: {
    fontSize: 36,
    opacity: 0.55,
    marginBottom: theme.spacing(0.5),
  },
  emptyHint: {
    color: theme.palette.text.secondary,
  },
}));

export default useStyles;
