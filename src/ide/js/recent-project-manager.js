import {unixTimestamp} from "./system-functions.js";

export class RecentProjectManager {
    /**
     * @param {object} storage - Storage interface with async get/set
     * @param {string} key - Storage key where recent projects are stored
     * @param {number} limit - Max number of recent projects to keep
     */
    constructor(storage, key = 'recentProjects', limit = 20) {
        this.storage = storage;
        this.key = key;
        this.limit = limit;
        this._items = null; // Lazy-load cache
    }

    // Ensure items are loaded exactly once before any operation
    async _ensureLoaded() {
        if (this._items !== null) return;

        const arr = await this.storage.get(this.key);
        this._items = Array.isArray(arr) ? arr : [];
    }

    // Normalize the internal array shape (defensive)
    _normalizeItems(items) {
        return items
            .filter(Boolean)
            .map(p => ({
                name: p.name ?? '',
                path: p.path ?? '',
                access: Number(p.access ?? 0),
            }))
            .filter(p => p.path !== '');
    }

    // Sort by most recent access (desc) and trim to limit
    _sortAndTrim(items) {
        return items
            .sort((a, b) => b.access - a.access)
            .slice(0, this.limit);
    }

    // Persist current cached items back to storage
    async _persist() {
        const trimmed = this._sortAndTrim(this._normalizeItems(this._items));
        this._items = trimmed;
        await this.storage.set(this.key, trimmed);
        await this.storage.save();
    }

    /**
     * Add a new recent project or update an existing one.
     * Duplication criterion is: same "path" => update access (and name).
     *
     * @param {string} name
     * @param {string} path
     */
    async addOrUpdate(name, path) {
        await this._ensureLoaded();

        const now = unixTimestamp();
        const idx = this._items.findIndex(p => p.path === path);

        if (idx !== -1) {
            // Duplicate found: update fields (refresh access)
            this._items[idx] = {
                ...this._items[idx],
                name,
                path,
                access: now,
            };
        } else {
            // Not found: append new entry
            this._items.push({ name, path, access: now });
        }

        await this._persist();
    }

    /**
     * Remove an item by index in the current sorted list (most recent first).
     *
     * @param {number} index
     */
    async remove(index) {
        await this._ensureLoaded();

        if (!Number.isInteger(index)) return;
        if (index < 0 || index >= this._items.length) return;

        // Remove the indexed entry
        this._items.splice(index, 1);

        await this._persist();
    }

    /**
     * Get all recent projects (sorted desc by access).
     *
     * @returns {Promise<Array<{name: string, path: string, access: number}>>}
     */
    async getAll() {
        await this._ensureLoaded();
        // Ensure we always return a trimmed/sorted view
        return  this._sortAndTrim(this._normalizeItems(this._items.slice()));
    }
}
