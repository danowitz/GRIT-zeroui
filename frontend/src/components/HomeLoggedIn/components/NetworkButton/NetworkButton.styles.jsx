import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  link: {
    display: "block",
    textDecoration: "none",
    color: theme.palette.text.primary,
    borderRadius: 9,
    "&:focus-visible": {
      outline: `3px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
    },
  },
  card: {
    minHeight: 76,
    display: "grid",
    gridTemplateColumns:
      "minmax(180px, 2fr) minmax(190px, 1.5fr) minmax(140px, 1fr) 24px",
    alignItems: "center",
    gap: theme.spacing(3),
    padding: theme.spacing(1.5, 2),
    background: "rgba(255, 255, 255, 0.025)",
    border: "1px solid rgba(255, 255, 255, 0.09)",
    borderRadius: 9,
    transition:
      "border-color 140ms ease, background-color 140ms ease, transform 140ms ease",
    "&:hover": {
      background: "rgba(255, 193, 7, 0.055)",
      borderColor: "rgba(255, 193, 7, 0.55)",
      transform: "translateY(-1px)",
    },
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) 20px",
      gap: theme.spacing(1.5),
    },
    [theme.breakpoints.down("xs")]: {
      gridTemplateColumns: "minmax(0, 1fr) 20px",
      padding: theme.spacing(1.5),
    },
  },
  nameColumn: {
    minWidth: 0,
    [theme.breakpoints.down("sm")]: {
      gridColumn: "1 / 3",
    },
    [theme.breakpoints.down("xs")]: {
      gridColumn: "1",
    },
  },
  detail: {
    minWidth: 0,
    [theme.breakpoints.down("xs")]: {
      gridColumn: "1",
    },
  },
  label: {
    color: theme.palette.text.secondary,
    fontSize: "0.6875rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    lineHeight: 1.3,
    textTransform: "uppercase",
    marginBottom: theme.spacing(0.4),
  },
  name: {
    fontSize: "0.9375rem",
    fontWeight: 600,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  nwid: {
    color: theme.palette.primary.light,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: "0.8125rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  cidr: {
    color: theme.palette.text.primary,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: "0.8125rem",
  },
  chevron: {
    color: theme.palette.text.secondary,
    transition: "transform 140ms ease, color 140ms ease",
    "$card:hover &": {
      color: theme.palette.primary.main,
      transform: "translateX(2px)",
    },
    [theme.breakpoints.down("sm")]: {
      gridColumn: "3",
      gridRow: "1 / 3",
    },
    [theme.breakpoints.down("xs")]: {
      gridColumn: "2",
      gridRow: "1 / 4",
    },
  },
}));

export default useStyles;
