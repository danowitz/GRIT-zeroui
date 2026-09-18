import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { Button, IconButton, Tooltip, Typography } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";
import useStyles from "./NetworkButton.styles";

import API from "utils/API";
import { cacheHubIp, readCachedHubIp } from "utils/HubIpCache";
import { getCIDRAddress } from "utils/IP";
// @ts-ignore Vite consumes this explicitly ESM utility; Node tests import it directly.
import { findHubIp } from "utils/NetworkList.mjs";
// @ts-ignore Vite consumes this explicitly ESM utility; Node tests import it directly.
import { requestRemoteSupport } from "utils/RemoteSupport.mjs";

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function NetworkButton({ network, refreshVersion = 0 }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const cardRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const [hubIp, setHubIp] = useState(/** @type {string | null} */ (null));
  const [shouldLoadHubIp, setShouldLoadHubIp] = useState(false);
  const [copiedValue, setCopiedValue] = useState("");
  const [supportStatus, setSupportStatus] = useState("");
  const pool = network.config?.ipAssignmentPools?.[0];
  const cidr = pool && getCIDRAddress(pool.ipRangeStart, pool.ipRangeEnd);
  const name = network.config?.name || t("unnamedNetwork");
  const accessedAt = Number(network.lastAccessedAt);
  const lastAccessed = Number.isFinite(accessedAt)
    ? formatDistanceToNow(accessedAt, { addSuffix: true })
    : t("neverAccessed");

  useEffect(() => {
    setShouldLoadHubIp(false);
    setHubIp(null);
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
  }, [network.id, refreshVersion]);

  useEffect(() => {
    let active = true;

    if (shouldLoadHubIp) {
      API.get(`network/${network.id}/member`)
        .then((response) => {
          if (!active) return;

          const resolvedIp = findHubIp(response.data);
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
  }, [network.id, shouldLoadHubIp]);

  const handleCopy = (value) => async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await copyText(value);
    setCopiedValue(value);
    window.setTimeout(() => setCopiedValue(""), 1500);
  };

  const copyButton = (value, label) => (
    <Tooltip title={copiedValue === value ? t("copied") : label}>
      <IconButton
        size="small"
        className={classes.copyButton}
        onClick={handleCopy(value)}
        aria-label={label}
      >
        {copiedValue === value ? (
          <CheckIcon fontSize="small" />
        ) : (
          <FileCopyOutlinedIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );

  useEffect(() => {
    const receiveResult = (event) => {
      if (event.source !== window.parent) return;
      if (
        event.origin !== "https://gritautomation.cloud" &&
        event.origin !== "https://app.gritautomation.cloud"
      )
        return;
      const data = event.data || {};
      if (
        data.type === "grit-support-result" &&
        data.networkId === network.id
      ) {
        setSupportStatus(data.message || data.status || "");
      }
    };
    window.addEventListener("message", receiveResult);
    return () => window.removeEventListener("message", receiveResult);
  }, [network.id]);

  const supportButton = (action, label, disabled = false) => (
    <Button
      size="small"
      variant="outlined"
      disabled={disabled}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setSupportStatus(`Requesting ${label}`);
        if (!requestRemoteSupport(network.id, action)) {
          setSupportStatus(
            "Open this page through GRIT Cloud to use Remote Support"
          );
        }
      }}
    >
      {label}
    </Button>
  );

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
      <div className={`${classes.detail} ${classes.networkDetail}`}>
        <Typography className={classes.label}>{t("networkId")}</Typography>
        <div className={classes.copyValue}>
          <Typography className={classes.nwid}>{network.id}</Typography>
          {copyButton(network.id, t("copyNetworkId"))}
        </div>
      </div>
      {hubIp && (
        <div className={`${classes.detail} ${classes.hubDetail}`}>
          <Typography className={classes.label}>{t("hubIpAddress")}</Typography>
          <div className={classes.copyValue}>
            <a
              className={classes.hubIp}
              href={`http://${hubIp}`}
              target="_blank"
              rel="noreferrer"
              aria-label={t("openHub", { ip: hubIp })}
            >
              {hubIp}
            </a>
            {copyButton(hubIp, t("copyHubIp"))}
          </div>
        </div>
      )}
      <div className={`${classes.detail} ${classes.cidrDetail}`}>
        <Typography className={classes.label}>{t("ipRange")}</Typography>
        <Typography className={classes.cidr}>
          {cidr || t("notAssigned")}
        </Typography>
      </div>
      <div className={`${classes.detail} ${classes.accessDetail}`}>
        <Typography className={classes.label}>{t("lastAccessed")}</Typography>
        <Typography className={classes.accessed}>{lastAccessed}</Typography>
      </div>
      <div
        className={classes.supportActions}
        aria-label="Remote Support actions"
      >
        {supportButton("connect", "Connect")}
        {supportButton("disconnect", "Disconnect")}
        {supportButton("ssh", "SSH to Hub", !hubIp)}
        {supportButton("open-hub", "Open Hub", !hubIp)}
        {supportStatus && (
          <Typography className={classes.supportStatus}>
            {supportStatus}
          </Typography>
        )}
      </div>
      <ChevronRightIcon className={classes.chevron} aria-hidden="true" />
    </div>
  );
}

export default NetworkButton;
