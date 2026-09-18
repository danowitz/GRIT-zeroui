import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backIcon: {
    fontSize: 12,
  },
  container: {
    margin: "3%",
    "html.grit-embedded &": {
      margin: 0,
    },
  },
  breadcrumbs: {
    paddingTop: "2%",
    paddingLeft: "2%",
    "html.grit-embedded &": {
      paddingTop: 0,
      paddingLeft: 0,
      marginBottom: theme.spacing(2),
    },
  },
}));

export default useStyles;
