// Which account links a user is offered, in display order.
export function accountMenuItems({ loggedIn, disabledAuth }) {
  if (!loggedIn) return [];
  return disabledAuth ? ["settings"] : ["settings", "logOut"];
}
