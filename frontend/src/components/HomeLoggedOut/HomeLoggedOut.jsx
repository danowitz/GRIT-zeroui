import { useEffect } from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import { useLocalStorage } from "react-use";
import { useHistory } from "react-router-dom";

import { useTranslation } from "react-i18next";

import axios from "axios";

import LogIn from "components/LogIn";
import { isEmbedded } from "utils/Embedded.mjs";

function HomeLoggedOut() {
  const [, setLoggedIn] = useLocalStorage("loggedIn", false);
  const [, setToken] = useLocalStorage("token", null);
  const [, setDisableAuth] = useLocalStorage("disableAuth", false);
  const history = useHistory();

  useEffect(() => {
    async function fetchData() {
      axios
        .get("/auth/login", { withCredentials: true })
        .then(function (response) {
          if (!response.data.enabled) {
            setLoggedIn(true);
            setDisableAuth(true);
            setToken("");
            history.go(0);
          } else {
            setDisableAuth(false);
          }
        });
    }
    fetchData();
  }, [history, setDisableAuth, setLoggedIn, setToken]);

  const { t, i18n } = useTranslation();

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{
        minHeight: "50vh",
      }}
    >
      <Grid item xs={10}>
        <Typography variant="h5">
          <span>{t("zerouiDesc")}</span>
        </Typography>

        <Typography>
          <span>{t("loginToContinue")}</span>
        </Typography>

        {/* The header bar is hidden inside GRIT Cloud, so offer log in here. */}
        {isEmbedded() && (
          <Box mt={2}>
            <LogIn />
          </Box>
        )}
      </Grid>
    </Grid>
  );
}

export default HomeLoggedOut;
