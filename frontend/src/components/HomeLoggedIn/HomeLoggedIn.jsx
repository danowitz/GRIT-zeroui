import { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";

import {
  Button,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import useStyles from "./HomeLoggedIn.styles";

import NetworkButton from "./components/NetworkButton";

import API from "utils/API";
import { getCIDRAddress } from "utils/IP";
import { generateNetworkConfig } from "utils/NetworkConfig";

import { useTranslation } from "react-i18next";

function HomeLoggedIn() {
  const [networks, setNetworks] = useState(
    /** @type {Array<any> | null} */ (null)
  );
  const [query, setQuery] = useState("");

  const classes = useStyles();
  const history = useHistory();

  const createNetwork = async () => {
    const network = await API.post("network", generateNetworkConfig());
    console.log(network);
    history.push("/network/" + network.data.config.id);
  };

  useEffect(() => {
    async function fetchData() {
      const networks = await API.get("network");
      setNetworks(networks.data);
      console.log("Networks:", networks.data);
    }
    fetchData();
  }, []);

  const { t } = useTranslation();

  const filteredNetworks = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!networks || !normalizedQuery) return networks || [];

    return networks.filter((network) => {
      const pool = network.config?.ipAssignmentPools?.[0];
      const cidr = pool && getCIDRAddress(pool.ipRangeStart, pool.ipRangeEnd);
      const searchableValues = [
        network.id,
        network.config?.name,
        cidr,
        pool?.ipRangeStart,
        pool?.ipRangeEnd,
      ];

      return searchableValues.some((value) =>
        String(value || "")
          .toLocaleLowerCase()
          .includes(normalizedQuery)
      );
    });
  }, [networks, query]);

  const networkCount = networks?.length || 0;
  const hasNetworks = networkCount > 0;
  const controllerId = networks?.[0]?.id;

  return (
    <main className={classes.root}>
      <section className={classes.hero}>
        <div>
          <Typography component="h1" variant="h4" className={classes.title}>
            {t("controllerNetworks")}
          </Typography>
          <Typography className={classes.subtitle}>
            {t("manageNetworks")}
          </Typography>
          {controllerId && (
            <div className={classes.controllerAddress}>
              <span>{t("controllerAddress")}</span>
              <strong>{controllerId.slice(0, 10)}</strong>
            </div>
          )}
        </div>
        <Button
          variant="contained"
          color="primary"
          className={classes.createBtn}
          onClick={createNetwork}
          startIcon={<AddIcon />}
        >
          {t("createNetwork")}
        </Button>
      </section>

      <section
        className={classes.networkSection}
        aria-labelledby="network-list-title"
      >
        <div className={classes.listToolbar}>
          <div>
            <Typography id="network-list-title" component="h2" variant="h6">
              {t("network", { count: networkCount })}
            </Typography>
            {hasNetworks && (
              <Typography className={classes.resultCount} aria-live="polite">
                {t("networkResults", {
                  shown: filteredNetworks.length,
                  total: networkCount,
                })}
              </Typography>
            )}
          </div>
          {hasNetworks && (
            <TextField
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              variant="outlined"
              size="small"
              className={classes.search}
              label={t("searchNetworks")}
              placeholder={t("searchNetworksPlaceholder")}
              inputProps={{ "aria-label": t("searchNetworks") }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: query ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setQuery("")}
                      aria-label={t("clearSearch")}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          )}
        </div>

        {networks === null ? (
          <div className={classes.emptyState}>{t("loadingNetworks")}</div>
        ) : !hasNetworks ? (
          <div className={classes.emptyState}>{t("createOneNetwork")}</div>
        ) : filteredNetworks.length ? (
          <div className={classes.networkList}>
            {filteredNetworks.map((network) => (
              <NetworkButton key={network.id} network={network} />
            ))}
          </div>
        ) : (
          <div className={classes.emptyState}>
            <SearchIcon className={classes.emptyIcon} />
            <Typography variant="h6">{t("noNetworksFound")}</Typography>
            <Typography className={classes.emptyHint}>
              {t("tryDifferentSearch")}
            </Typography>
            <Button onClick={() => setQuery("")} color="primary">
              {t("clearSearch")}
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}

export default HomeLoggedIn;
