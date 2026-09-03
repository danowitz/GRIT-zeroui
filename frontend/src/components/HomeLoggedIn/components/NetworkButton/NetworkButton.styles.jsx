import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  link: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    borderRadius: 9,
    "&:focus-visible": {
      outline: `3px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
    },
  },
  srOnly: {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
  },
  card: {
    position: "relative",
    minHeight: 76,
    display: "grid",
    gridTemplateColumns:
      "minmax(180px, 2fr) minmax(180px, 1.4fr) minmax(120px, 1fr) minmax(120px, 1fr) 24px",
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
  hubDetail: {
    position: "relative",
    zIndex: 2,
    [theme.breakpoints.down("sm")]: {
      gridColumn: "1 / 3",
    },
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
  hubIp: {
    color: theme.palette.primary.light,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: "0.8125rem",
    textDecoration: "underline",
    textUnderlineOffset: 3,
    "&:hover": {
      color: theme.palette.primary.main,
    },
    "&:focus-visible": {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 3,
      borderRadius: 2,
    },
  },
  chevron: {
    gridColumn: "5",
    color: theme.palette.text.secondary,
    transition: "transform 140ms ease, color 140ms ease",
    "$card:hover &": {
      color: theme.palette.primary.main,
      transform: "translateX(2px)",
    },
    [theme.breakpoints.down("sm")]: {
      gridColumn: "3",
      gridRow: "1 / 4",
    },
    [theme.breakpoints.down("xs")]: {
      gridColumn: "2",
      gridRow: "1 / 5",
    },
  },
}));

export default useStyles;
