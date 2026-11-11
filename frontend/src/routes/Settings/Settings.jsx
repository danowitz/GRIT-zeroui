import { Link } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import SettingsComponent from "components/Settings";
import NotAuthorized from "components/NotAuthorized";

import { Link as RouterLink } from "react-router-dom";
import { useLocalStorage } from "react-use";

import useStyles from "./Settings.styles";

import { useTranslation } from "react-i18next";

function Settings() {
  const { t, i18n } = useTranslation();
  const [loggedIn] = useLocalStorage("loggedIn", false);

  const classes = useStyles();

  if (loggedIn) {
    return (
      <>
        <div className={classes.breadcrumbs}>
          <Link color="inherit" component={RouterLink} to="/" underline="none">
            <ArrowBackIcon className={classes.backIcon}></ArrowBackIcon>
            {t("settings")}
          </Link>
        </div>
        <div className={classes.container}>
          <SettingsComponent />
        </div>
      </>
    );
  } else {
    return <NotAuthorized />;
  }
}

export default Settings;
