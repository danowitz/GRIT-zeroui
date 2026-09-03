import { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";

import {
  Button,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import RefreshIcon from "@material-ui/icons/Refresh";
import SearchIcon from "@material-ui/icons/Search";
import useStyles from "./HomeLoggedIn.styles";

import NetworkButton from "./components/NetworkButton";

import API from "utils/API";
import { clearHubIpCache } from "utils/HubIpCache";
import { getCIDRAddress } from "utils/IP";
import { generateNetworkConfig } from "utils/NetworkConfig";

import { useTranslation } from "react-i18next";

function HomeLoggedIn() {
  const [networks, setNetworks] = useState(
    /** @type {Array<any> | null} */ (null)
  );
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [hubIpRefreshVersion, setHubIpRefreshVersion] = useState(0);

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

  const refreshHubIps = () => {
    clearHubIpCache();
    setHubIpRefreshVersion((version) => version + 1);
  };

  const visibleNetworks = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const filtered = (networks || []).filter((network) => {
      if (!normalizedQuery) return true;

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

    return filtered
      .map((network, index) => ({ network, index }))
      .sort((left, right) => {
        if (sortBy === "name") {
          const leftName = left.network.config?.name || "";
          const rightName = right.network.config?.name || "";
          return (
            leftName.localeCompare(rightName, undefined, {
              sensitivity: "base",
              numeric: true,
            }) || left.index - right.index
          );
        }

        const leftCreationTime = left.network.config?.creationTime;
        const rightCreationTime = right.network.config?.creationTime;
        const leftCreated = Number(leftCreationTime);
        const rightCreated = Number(rightCreationTime);
        const leftHasCreationTime =
          leftCreationTime != null && Number.isFinite(leftCreated);
        const rightHasCreationTime =
          rightCreationTime != null && Number.isFinite(rightCreated);

        if (leftHasCreationTime !== rightHasCreationTime) {
          return leftHasCreationTime ? -1 : 1;
        }
        if (!leftHasCreationTime) return left.index - right.index;

        const difference = rightCreated - leftCreated;
        return (
          (sortBy === "oldest" ? -difference : difference) ||
          left.index - right.index
        );
      })
      .map(({ network }) => network);
  }, [networks, query, sortBy]);

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
                  shown: visibleNetworks.length,
                  total: networkCount,
                })}
              </Typography>
            )}
          </div>
          {hasNetworks && (
            <div className={classes.listControls}>
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
              <FormControl
                variant="outlined"
                size="small"
                className={classes.sort}
              >
                <InputLabel id="network-sort-label">{t("sortBy")}</InputLabel>
                <Select
                  labelId="network-sort-label"
                  value={sortBy}
                  onChange={(event) => setSortBy(String(event.target.value))}
                  label={t("sortBy")}
                  inputProps={{ "aria-label": t("sortNetworks") }}
                >
                  <MenuItem value="recent">{t("recent")}</MenuItem>
                  <MenuItem value="oldest">{t("oldest")}</MenuItem>
                  <MenuItem value="name">{t("nameAscending")}</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                color="primary"
                className={classes.refreshHubIps}
                onClick={refreshHubIps}
                startIcon={<RefreshIcon />}
              >
                {t("refreshHubIps")}
              </Button>
            </div>
          )}
        </div>

        {networks === null ? (
          <div className={classes.emptyState}>{t("loadingNetworks")}</div>
        ) : !hasNetworks ? (
          <div className={classes.emptyState}>{t("createOneNetwork")}</div>
        ) : visibleNetworks.length ? (
          <div className={classes.networkList}>
            {visibleNetworks.map((network) => (
              <NetworkButton
                key={network.id}
                network={network}
                refreshVersion={hubIpRefreshVersion}
              />
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
