const CLOUD_ORIGINS = new Set([
  "https://gritautomation.cloud",
  "https://app.gritautomation.cloud",
]);
const ACTIONS = new Set(["connect", "disconnect", "ssh", "open-hub"]);

export function cloudParentOrigin(referrer = document.referrer) {
  try {
    const origin = new URL(referrer).origin;
    return CLOUD_ORIGINS.has(origin) ? origin : null;
  } catch {
    return null;
  }
}

export function requestRemoteSupport(
  networkId,
  action,
  target = window.parent
) {
  const origin = cloudParentOrigin();
  const normalized = String(networkId || "").toLowerCase();
  if (!origin || !/^[0-9a-f]{16}$/.test(normalized) || !ACTIONS.has(action)) {
    return false;
  }
  target.postMessage(
    { type: "grit-support-action", networkId: normalized, action },
    origin
  );
  return true;
}
