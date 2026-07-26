export class AssetStore {
    constructor() {
        /** @private */
        this._assets = new Map();

        /** @private */
        this._trash = new Map();

        /** @private */
        this._livePreviews = new Map();
    }

    /**
     * Registers a new asset.
     *
     * Thumbnail assets automatically receive a persistent live preview.
     *
     * @param {string} assetHashId - Unique asset identifier.
     * @param {string} type - Asset type.
     * @param {Blob} blob - Asset binary data.
     * @returns {boolean} True if the asset was registered successfully.
     */
    register(assetHashId, type, blob) {
        if (this._assets.has(assetHashId)) {
            return false;
        }

        this._assets.set(assetHashId, {
            blob,
            type,
        });

        return true;
    }

    /**
     * Updates an existing asset.
     *
     * If the asset already owns a live preview, the Object URL
     * will be refreshed automatically.
     *
     * @param {string} assetHashId - Asset identifier.
     * @param {Blob} blob - Updated binary data.
     * @returns {boolean} True if the asset was updated.
     */
    update(assetHashId, blob) {
        console.log('update asset', assetHashId, blob);
        const asset = this._assets.get(assetHashId);

        if (!asset) {
            return false;
        }

        asset.blob = blob;

        if (this._livePreviews.has(assetHashId)) {
            this._refreshLivePreview(assetHashId);
        }

        return true;
    }

    /**
     * Returns a live preview URL for an asset.
     *
     * The preview is created lazily and cached until released.
     *
     * @param {string} assetHashId - Asset identifier.
     * @returns {string|null} Object URL or null if the asset does not exist.
     */
    getLivePreview(assetHashId) {

        // console.log('trying to get live preview', assetHashId);
        if (!this._assets.has(assetHashId)) {
            return null;
        }

        if (!this._livePreviews.has(assetHashId)) {
            // console.log('trying to create live preview', assetHashId);
            this._createLivePreview(assetHashId);
        }

        return this._livePreviews.get(assetHashId);
    }

    /**
     * Releases the live preview of an asset.
     *
     * Thumbnail assets always keep their preview alive.
     *
     * @param {string} assetHashId - Asset identifier.
     * @returns {boolean} True if the preview was released.
     */
    releaseLivePreview(assetHashId) {
        const asset = this._assets.get(assetHashId);

        if (!asset) {
            return false;
        }

        return this._revokeLivePreview(assetHashId);
    }

    /**
     * Moves an asset into the trash.
     *
     * The live preview is intentionally preserved to support undo.
     *
     * @param {string} assetHashId - Asset identifier.
     * @returns {boolean} True if the asset was moved.
     */
    remove(assetHashId) {
        if (!this._assets.has(assetHashId)) {
            return false;
        }

        this._trash.set(assetHashId, this._assets.get(assetHashId));
        this._assets.delete(assetHashId);

        return true;
    }

    /**
     * Restores an asset from the trash.
     *
     * @param {string} assetHashId - Asset identifier.
     * @returns {boolean} True if the asset was restored.
     */
    restore(assetHashId) {
        if (!this._trash.has(assetHashId)) {
            return false;
        }

        this._assets.set(assetHashId, this._trash.get(assetHashId));
        this._trash.delete(assetHashId);

        return true;
    }

    /**
     * Permanently removes all trashed assets.
     *
     * Any remaining live previews belonging to trashed assets
     * will also be released.
     */
    clearTrash() {
        for (const assetHashId of this._trash.keys()) {
            this._revokeLivePreview(assetHashId);
        }

        this._trash.clear();
    }

    /**
     * Clears the entire asset store.
     */
    clear() {
        for (const assetHashId of this._livePreviews.keys()) {
            URL.revokeObjectURL(this._livePreviews.get(assetHashId));
        }

        this._livePreviews.clear();
        this._trash.clear();
        this._assets.clear();
    }

    /**
     * Creates a live preview for an asset.
     *
     * @private
     * @param {string} assetHashId - Asset identifier.
     * @returns {string|null} Created Object URL.
     */
    _createLivePreview(assetHashId) {
        const asset = this._assets.get(assetHashId);

        if (!asset) {
            return null;
        }

        const objectURL = URL.createObjectURL(asset.blob);

        this._livePreviews.set(assetHashId, objectURL);
        console.log('createLivePreview final', assetHashId);

        return objectURL;
    }

    /**
     * Refreshes an existing live preview.
     *
     * @private
     * @param {string} assetHashId - Asset identifier.
     * @returns {boolean} True if the preview was refreshed.
     */
    _refreshLivePreview(assetHashId) {
        this._revokeLivePreview(assetHashId);
        return this._createLivePreview(assetHashId) !== null;
    }

    /**
     * Revokes and removes a live preview.
     *
     * @private
     * @param {string} assetHashId - Asset identifier.
     * @returns {boolean} True if a preview existed.
     */
    _revokeLivePreview(assetHashId) {
        if (!this._livePreviews.has(assetHashId)) {
            return false;
        }

        URL.revokeObjectURL(this._livePreviews.get(assetHashId));
        this._livePreviews.delete(assetHashId);

        return true;
    }

    /**
     * Exports all assets of the specified type.
     *
     * The returned array contains only the asset identifier and its binary data,
     * making it suitable for serialization or saving.
     *
     * @param {string} type - Asset type to export.
     * @returns {{id: string, data: Blob}[]} Exported assets.
     */
    async export(type) {
        const result = [];

        for (const [id, asset] of this._assets) {
            if (asset.type !== type) {
                continue;
            }

            result.push({
                id,
                data:  new Uint8Array(await asset.blob.arrayBuffer()),
            });
        }

        return result;
    }
}

// Singleton
const assetStore = new AssetStore();

export default assetStore;