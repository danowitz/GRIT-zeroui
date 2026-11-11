import { Box, Button } from "@material-ui/core";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { useLocalStorage } from "react-use";

import { useTranslation } from "react-i18next";

import { accountMenuItems } from "utils/AccountMenu.mjs";

// Stands in for the header bar's menu, which is hidden inside GRIT Cloud.
function EmbeddedAccountMenu() {
  const [loggedIn, setLoggedIn] = useLocalStorage("loggedIn", false);
  const [disabledAuth] = useLocalStorage("disableAuth", false);
  const history = useHistory();
  const { t } = useTranslation();

  const onLogOutClick = () => {
    setLoggedIn(false);
    localStorage.clear();
    history.push("/");
    history.go(0);
  };

  const items = accountMenuItems({ loggedIn, disabledAuth });
  if (items.length === 0) return null;

  return (
    <Box display="flex" justifyContent="flex-end" mb={1}>
      {items.includes("settings") && (
        <Button size="small" component={RouterLink} to="/settings">
          {t("settings")}
        </Button>
      )}
      {items.includes("logOut") && (
        <Button size="small" onClick={onLogOutClick}>
          {t("logOut")}
        </Button>
      )}
    </Box>
  );
}

export default EmbeddedAccountMenu;
