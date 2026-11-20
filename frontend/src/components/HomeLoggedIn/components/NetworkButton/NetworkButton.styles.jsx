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
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.2fr) minmax(155px, 1.2fr) minmax(125px, 1fr) minmax(120px, 1fr) minmax(85px, .8fr) 20px",
    gridTemplateAreas:
      '"name network hub range access chevron" "actions actions actions actions actions chevron"',
    alignItems: "center",
    gap: theme.spacing(0.75, 1.5),
    padding: theme.spacing(1.25, 1.5),
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
      gridTemplateAreas:
        '"name access chevron" "network hub chevron" "range hub chevron" "actions actions actions"',
      gap: theme.spacing(0.5, 1.5),
    },
    [theme.breakpoints.down("xs")]: {
      gridTemplateColumns: "minmax(155px, 1.2fr) minmax(0, 1fr) 16px",
      gridTemplateAreas:
        '"name name chevron" "network access chevron" "hub range range" "actions actions actions"',
      padding: theme.spacing(1, 1.25),
      gap: theme.spacing(0.5, 1),
    },
  },
  nameColumn: {
    gridArea: "name",
    minWidth: 0,
  },
  detail: {
    minWidth: 0,
  },
  networkDetail: {
    gridArea: "network",
    [theme.breakpoints.down("sm")]: {
      "& > $label": { display: "none" },
    },
  },
  hubDetail: {
    gridArea: "hub",
    position: "relative",
    zIndex: 2,
  },
  cidrDetail: {
    gridArea: "range",
    [theme.breakpoints.between("sm", "sm")]: {
      display: "flex",
      alignItems: "baseline",
      gap: theme.spacing(0.75),
      "& > $label": { marginBottom: 0 },
    },
  },
  accessDetail: {
    gridArea: "access",
    [theme.breakpoints.down("sm")]: {
      justifySelf: "end",
      "& > $label": { display: "none" },
    },
  },
  supportActions: {
    gridArea: "actions",
    position: "relative",
    zIndex: 3,
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(0.5),
    "& .MuiButton-root": {
      fontSize: "0.68rem",
      padding: theme.spacing(0.25, 0.75),
    },
    "@media (pointer: coarse)": {
      "& .MuiButton-root": {
        minHeight: 44,
        flex: "1 0 auto",
      },
    },
  },
  supportStatus: {
    flexBasis: "100%",
    color: theme.palette.text.secondary,
    fontSize: "0.7rem",
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
    overflowWrap: "anywhere",
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
    gridArea: "chevron",
    color: theme.palette.text.secondary,
    transition: "transform 140ms ease, color 140ms ease",
    "$card:hover &": {
      color: theme.palette.primary.main,
      transform: "translateX(2px)",
    },
  },
}));

export default useStyles;
