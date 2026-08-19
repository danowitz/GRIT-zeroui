/**
 * Create a controller network and persist its ZeroUI metadata.
 * @param {object} data - Network API request data.
 * @param {object} dependencies - External controller and metadata store.
 * @param {object} dependencies.controller - ZeroTier controller adapter.
 * @param {object} dependencies.store - ZeroUI network metadata store.
 * @returns {Promise<object>} The combined controller and metadata representation.
 */
export async function createNetwork(data, { controller, store }) {
  const config = { ...data.config };
  const created = await controller.create(config);
  await store.createNetworkAdditionalData(created.id, {
    description: data.description,
    config,
  });
  return store.getNetwork(created.id);
}

/**
 * Delete a controller network before removing its ZeroUI metadata.
 * @param {string} nwid - ZeroTier network ID.
 * @param {object} dependencies - External controller and metadata store.
 * @param {object} dependencies.controller - ZeroTier controller adapter.
 * @param {object} dependencies.store - ZeroUI network metadata store.
 * @returns {Promise<object>} The controller deletion result.
 */
export async function deleteNetwork(nwid, { controller, store }) {
  let result;
  try {
    result = await controller.delete(nwid);
  } catch (err) {
    const failure = /** @type {{ response?: { status?: number } }} */ (err);
    if (!failure.response || failure.response.status !== 404) {
      throw err;
    }
    result = { status: 204 };
  }
  await store.deleteNetworkAdditionalData(nwid);
  return result;
}
