// True when ZeroUI is running inside a frame (e.g. GRIT Cloud).
export function isEmbedded(win = window) {
  try {
    return win.self !== win.top;
  } catch {
    // Cross-origin access means this app is embedded.
    return true;
  }
}
