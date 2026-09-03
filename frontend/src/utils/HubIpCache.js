const HUB_IP_CACHE_PREFIX = "zero-ui:hub-ip:v1:";
const HUB_IP_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function isIPv4(value) {
  const parts = String(value || "").split(".");
  return (
    parts.length === 4 &&
    parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255)
  );
}

export function readCachedHubIp(networkId) {
  if (typeof localStorage === "undefined") return null;

  try {
    const cached = JSON.parse(
      localStorage.getItem(HUB_IP_CACHE_PREFIX + networkId) || "null"
    );
    if (
      !cached ||
      !isIPv4(cached.ip) ||
      !Number.isFinite(Number(cached.cachedAt))
    ) {
      return null;
    }

    return {
      ip: cached.ip,
      fresh: Date.now() - Number(cached.cachedAt) < HUB_IP_CACHE_TTL_MS,
    };
  } catch {
    return null;
  }
}

export function cacheHubIp(networkId, ip) {
  if (typeof localStorage === "undefined") return;

  try {
    if (ip) {
      localStorage.setItem(
        HUB_IP_CACHE_PREFIX + networkId,
        JSON.stringify({ ip, cachedAt: Date.now() })
      );
    } else {
      localStorage.removeItem(HUB_IP_CACHE_PREFIX + networkId);
    }
  } catch {
    // Storage may be unavailable; the live result still remains usable.
  }
}

export function clearHubIpCache() {
  if (typeof localStorage === "undefined") return;

  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(HUB_IP_CACHE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  } catch {
    // Storage may be unavailable; callers can still retry live lookups.
  }
}

export { isIPv4 };
