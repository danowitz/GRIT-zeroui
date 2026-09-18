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
      "minmax(160px, 1.7fr) minmax(190px, 1.35fr) minmax(135px, 1fr) minmax(115px, .8fr) minmax(125px, .9fr) 24px",
    alignItems: "center",
    gap: theme.spacing(3),
    padding: theme.spacing(1.5, 2),
    background: "#ffffff",
    border: "1px solid #dfe2e5",
    borderRadius: 9,
    transition:
      "border-color 140ms ease, background-color 140ms ease, transform 140ms ease",
    "&:hover": {
      background: "#fff8f5",
      borderColor: theme.palette.primary.main,
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
  networkDetail: {
    gridColumn: "2",
    [theme.breakpoints.down("sm")]: {
      gridColumn: "1",
    },
    [theme.breakpoints.down("xs")]: {
      gridColumn: "1",
    },
  },
  hubDetail: {
    gridColumn: "3",
    position: "relative",
    zIndex: 2,
    [theme.breakpoints.down("sm")]: {
      gridColumn: "2",
    },
    [theme.breakpoints.down("xs")]: {
      gridColumn: "1",
    },
  },
  cidrDetail: {
    gridColumn: "4",
    [theme.breakpoints.down("sm")]: {
      gridColumn: "1",
    },
    [theme.breakpoints.down("xs")]: {
      gridColumn: "1",
    },
  },
  accessDetail: {
    gridColumn: "5",
    [theme.breakpoints.down("sm")]: {
      gridColumn: "2",
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
    color: theme.palette.text.primary,
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
  accessed: {
    color: theme.palette.text.secondary,
    fontSize: "0.8125rem",
  },
  copyValue: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
    minWidth: 0,
  },
  copyButton: {
    position: "relative",
    zIndex: 3,
    flexShrink: 0,
    padding: 4,
    color: theme.palette.primary.main,
  },
  hubIp: {
    color: theme.palette.primary.dark,
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
    gridColumn: "6",
    color: theme.palette.text.secondary,
    transition: "transform 140ms ease, color 140ms ease",
    "$card:hover &": {
      color: theme.palette.primary.main,
      transform: "translateX(2px)",
    },
    [theme.breakpoints.down("sm")]: {
      gridColumn: "3",
      gridRow: "1 / 6",
    },
    [theme.breakpoints.down("xs")]: {
      gridColumn: "2",
      gridRow: "1 / 6",
    },
  },
}));

export default useStyles;
