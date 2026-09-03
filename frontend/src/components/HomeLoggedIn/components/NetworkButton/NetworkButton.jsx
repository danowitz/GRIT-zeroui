import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { Typography } from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useTranslation } from "react-i18next";
import useStyles from "./NetworkButton.styles";

import API from "utils/API";
import { cacheHubIp, isIPv4, readCachedHubIp } from "utils/HubIpCache";
import { getCIDRAddress } from "utils/IP";

function findHubIp(members, networkId) {
  const controllerId = String(networkId || "").slice(0, 10);
  const candidates = (members || [])
    .filter(
      (member) =>
        member.config?.authorized === true &&
        member.config?.address !== controllerId
    )
    .map((member) => ({
      member,
      ip: member.config?.ipAssignments?.find(isIPv4),
    }))
    .filter(({ ip }) => Boolean(ip));

  const namedHub = candidates.find(({ member }) =>
    String(member.name || "")
      .toLocaleLowerCase()
      .includes("hub")
  );
  return namedHub?.ip || candidates[0]?.ip || null;
}

function NetworkButton({ network, refreshVersion = 0 }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const cardRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const [hubIp, setHubIp] = useState(/** @type {string | null} */ (null));
  const [shouldLoadHubIp, setShouldLoadHubIp] = useState(false);
  const pool = network.config?.ipAssignmentPools?.[0];
  const cidr = pool && getCIDRAddress(pool.ipRangeStart, pool.ipRangeEnd);
  const name = network.config?.name || t("unnamedNetwork");
  const isHubNetwork = String(network.config?.name || "")
    .toLocaleLowerCase()
    .includes("hub");

  useEffect(() => {
    setShouldLoadHubIp(false);
    setHubIp(null);
    if (!isHubNetwork) return;

    const cached = readCachedHubIp(network.id);
    if (cached) setHubIp(cached.ip);
    if (cached?.fresh) return;

    const card = cardRef.current;
    if (!card || typeof IntersectionObserver === "undefined") {
      setShouldLoadHubIp(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadHubIp(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );
    observer.observe(card);

    return () => observer.disconnect();
  }, [isHubNetwork, network.id, refreshVersion]);

  useEffect(() => {
    let active = true;

    if (isHubNetwork && shouldLoadHubIp) {
      API.get(`network/${network.id}/member`)
        .then((response) => {
          if (!active) return;

          const resolvedIp = findHubIp(response.data, network.id);
          setHubIp(resolvedIp);
          cacheHubIp(network.id, resolvedIp);
        })
        .catch(() => {
          // Keep a stale cached address available when a refresh cannot finish.
        });
    }

    return () => {
      active = false;
    };
  }, [isHubNetwork, network.id, shouldLoadHubIp]);

  return (
    <div ref={cardRef} className={classes.card}>
      <Link
        to={"/network/" + network.id}
        className={classes.link}
        aria-label={`${name}, ${network.id}${cidr ? `, ${cidr}` : ""}`}
      >
        <span className={classes.srOnly}>{name}</span>
      </Link>
      <div className={classes.nameColumn}>
        <Typography className={classes.label}>
          {t("network", { count: 1 })}
        </Typography>
        <Typography className={classes.name}>{name}</Typography>
      </div>
      <div className={classes.detail}>
        <Typography className={classes.label}>{t("networkId")}</Typography>
        <Typography className={classes.nwid}>{network.id}</Typography>
      </div>
      <div className={classes.detail}>
        <Typography className={classes.label}>{t("ipRange")}</Typography>
        <Typography className={classes.cidr}>
          {cidr || t("notAssigned")}
        </Typography>
      </div>
      {hubIp && (
        <div className={`${classes.detail} ${classes.hubDetail}`}>
          <Typography className={classes.label}>{t("hubIpAddress")}</Typography>
          <a
            className={classes.hubIp}
            href={`http://${hubIp}`}
            target="_blank"
            rel="noreferrer"
            aria-label={t("openHub", { ip: hubIp })}
          >
            {hubIp}
          </a>
        </div>
      )}
      <ChevronRightIcon className={classes.chevron} aria-hidden="true" />
    </div>
  );
}

export default NetworkButton;
