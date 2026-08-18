import { Link } from "react-router-dom";

import { Typography } from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useTranslation } from "react-i18next";
import useStyles from "./NetworkButton.styles";

import { getCIDRAddress } from "utils/IP";

function NetworkButton({ network }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const pool = network.config?.ipAssignmentPools?.[0];
  const cidr = pool && getCIDRAddress(pool.ipRangeStart, pool.ipRangeEnd);
  const name = network.config?.name || t("unnamedNetwork");

  return (
    <Link
      to={"/network/" + network.id}
      className={classes.link}
      aria-label={`${name}, ${network.id}${cidr ? `, ${cidr}` : ""}`}
    >
      <div className={classes.card}>
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
        <ChevronRightIcon className={classes.chevron} aria-hidden="true" />
      </div>
    </Link>
  );
}

export default NetworkButton;
