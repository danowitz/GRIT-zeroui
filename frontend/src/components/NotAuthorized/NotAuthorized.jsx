import { Box, Grid, Typography } from "@material-ui/core";

import { useTranslation } from "react-i18next";

import LogIn from "components/LogIn";
import { isEmbedded } from "utils/Embedded.mjs";

function NotAuthorized() {
  const { t } = useTranslation();

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
        <Typography variant="h5">{t("notAuthorized")}</Typography>

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

export default NotAuthorized;
