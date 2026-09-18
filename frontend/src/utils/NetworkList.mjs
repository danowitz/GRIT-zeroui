function isIPv4(value) {
  const parts = String(value || "").split(".");
  return (
    parts.length === 4 &&
    parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255)
  );
}

export function findHubIp(members) {
  const hub = (members || []).find((member) =>
    String(member.name || "")
      .toLocaleLowerCase()
      .includes("hub")
  );

  return hub?.config?.ipAssignments?.find(isIPv4) || null;
}

function creationTime(network) {
  const value = Number(network.config?.creationTime);
  return Number.isFinite(value) ? value : Number.NEGATIVE_INFINITY;
}

function accessTime(network) {
  const value = Number(network.lastAccessedAt);
  return Number.isFinite(value) ? value : Number.NEGATIVE_INFINITY;
}

export function sortNetworks(networks, sortBy) {
  return (networks || [])
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

      if (sortBy === "oldest") {
        return (
          creationTime(left.network) - creationTime(right.network) ||
          left.index - right.index
        );
      }

      const accessedDifference =
        accessTime(right.network) - accessTime(left.network);
      if (accessedDifference) return accessedDifference;

      return (
        creationTime(right.network) - creationTime(left.network) ||
        left.index - right.index
      );
    })
    .map(({ network }) => network);
}
