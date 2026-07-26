export class ResourceManager {

    constructor() {
        this.resources = new Map();
        this.folders = new Set();
        this.urls = new Map();

        // Stores deleted items for restore operations.
        this.trash = new Map();

        // Generates unique ids for deleted items.
        this._trashId = 0;
    }


    /**
     * Normalize resource path.
     *
     * @example
     * normalize("images/logo.png")
     * returns "/images/logo.png"
     */
    _normalize(path) {
        if (!path) {
            throw new Error("Invalid resource path");
        }

        path = path.replaceAll("\\", "/");

        if (!path.startsWith("/")) {
            path = "/" + path;
        }

        return path;
    }


    /**
     * Extract folder from resource path.
     *
     * @example
     * folderOf("/images/logo.png")
     * returns "images"
     */
    _folderOf(path) {
        const parts = path.split("/");

        parts.pop();

        return parts.join("/") || "/";
    }


    /**
     * Extract file extension.
     */
    _getExt(path) {
        const name = path.split("/").pop();

        const match = name.match(/\.([^.]+)$/);

        return match ? match[1].toLowerCase() : "";
    }

    /**
     * Store deleted item snapshot.
     *
     * @example
     * const id = manager._backup({
     *     type: "resource",
     *     data: resource
     * });
     */
    _backup(item) {

        const id = ++this._trashId;

        this.trash.set(id, {
            id,
            deletedAt: Date.now(),
            ...item
        });

        return id;
    }

    /**
     * Add a folder.
     *
     * @example
     * manager.addFolder("images");
     */
    addFolder(folder) {
        folder = folder.replaceAll("\\", "/");

        if (folder.startsWith("/")) {
            folder = folder.substring(1);
        }

        if (!folder) {
            return false;
        }

        if (this.folders.has(folder)) {
            return false;
        }

        this.folders.add(folder);

        return true;
    }


    /**
     * Add a resource.
     *
     * @example
     * manager.add("/images/logo.png", blob);
     */
    add(path, blob) {

        path = this._normalize(path);


        if (!(blob instanceof Blob)) {
            throw new Error("Resource must be a Blob");
        }


        if (this.resources.has(path)) {
            return false;
        }


        const folder = this._folderOf(path);

        if (folder !== "/") {
            this.addFolder(folder);
        }


        this.resources.set(path, {
            path,
            name: path.split("/").pop(),
            folder,
            blob,
            size: blob.size,
            type: blob.type,
            ext: this._getExt(path)
        });


        return true;
    }


    /**
     * Get a resource.
     *
     * @example
     * manager.get("/images/logo.png");
     */
    get(path) {
        path = this._normalize(path);

        return this.resources.get(path) || null;
    }


    /**
     * Check resource existence.
     *
     * @example
     * manager.has("/images/logo.png");
     */
    has(path) {
        path = this._normalize(path);

        return this.resources.has(path);
    }

    /**
     * Remove resource and keep it available for restore.
     *
     * @example
     * const id = manager.remove("/images/logo.png");
     *
     * manager.restore(id);
     */
    remove(path) {

        path = this._normalize(path);


        const resource = this.resources.get(path);


        if (!resource) {
            return false;
        }


        this._backup({
            type: "resource",
            data: resource
        });


        this.revokeURL(path);

        this.resources.delete(path);


        return true;
    }


    /**
     * List resources.
     *
     * @example
     * manager.list();
     *
     * @example
     * manager.list("/images");
     */
    list(folder = null) {

        if (!folder) {
            return [...this.resources.values()];
        }


        folder = this._normalize(folder);


        return [...this.resources.values()]
            .filter(r => r.folder === folder);
    }


    /**
     * Return all folders.
     */
    getFolders() {
        return [...this.folders];
    }


    /**
     * Remove folder and keep deleted resources for restore.
     *
     * @example
     * const id = manager.removeFolder("images");
     *
     * manager.restore(id);
     */
    removeFolder(folder) {

        folder = folder.replaceAll("\\", "/");


        const deleted = {
            type: "folder",
            folder,
            resources: []
        };


        for (const [path, resource] of this.resources) {

            if (path.startsWith("/" + folder + "/")) {

                deleted.resources.push(resource);

                this.revokeURL(path);

                this.resources.delete(path);
            }
        }


        if (!this.folders.has(folder)) {
            return false;
        }


        this.folders.delete(folder);


        return this._backup(deleted);
    }


    /**
     * Create preview URL for resource.
     *
     * @example
     * const url = manager.url("/images/photo.jpg");
     *
     * img.src = url;
     */
    url(path) {

        path = this._normalize(path);


        if (this.urls.has(path)) {
            return this.urls.get(path);
        }


        const resource = this.get(path);


        if (!resource) {
            return null;
        }


        const url = URL.createObjectURL(resource.blob);


        this.urls.set(path, url);


        return url;
    }


    /**
     * Revoke preview URL.
     *
     * @example
     * manager.revokeURL("/images/photo.jpg");
     */
    revokeURL(path) {

        path = this._normalize(path);


        const url = this.urls.get(path);


        if (!url) {
            return false;
        }


        URL.revokeObjectURL(url);

        this.urls.delete(path);


        return true;
    }


    /**
     * Move resource to another path.
     *
     * @example
     * manager.move(
     *   "/images/logo.png",
     *   "/icons/logo.png"
     * );
     */
    move(oldPath, newPath) {

        oldPath = this._normalize(oldPath);
        newPath = this._normalize(newPath);


        const resource = this.resources.get(oldPath);


        if (!resource || this.resources.has(newPath)) {
            return false;
        }


        this.resources.delete(oldPath);


        resource.path = newPath;
        resource.name = newPath.split("/").pop();
        resource.folder = this._folderOf(newPath);


        this.resources.set(newPath, resource);


        const url = this.urls.get(oldPath);

        if (url) {
            this.urls.delete(oldPath);
            this.urls.set(newPath, url);
        }


        return true;
    }


    /**
     * Rename resource inside same folder.
     *
     * @example
     * manager.rename(
     *   "/images/a.png",
     *   "b.png"
     * );
     */
    rename(path, newName) {

        path = this._normalize(path);


        const folder = this._folderOf(path);


        return this.move(
            path,
            `${folder}/${newName}`
        );
    }


    /**
     * Get total resources count.
     */
    count() {
        return this.resources.size;
    }


    /**
     * Calculate total storage size.
     */
    size() {

        let total = 0;

        for (const resource of this.resources.values()) {
            total += resource.size;
        }

        return total;
    }


    /**
     * Clear all resources.
     */
    clear() {

        for (const path of this.resources.keys()) {
            this.revokeURL(path);
        }

        this.resources.clear();
        this.folders.clear();
    }


    /**
     * Release all generated URLs.
     *
     * Call when manager is no longer needed.
     */
    destroy() {

        for (const url of this.urls.values()) {
            URL.revokeObjectURL(url);
        }


        this.urls.clear();
        this.resources.clear();
        this.folders.clear();
        this.trash.clear();
    }


    /**
     * Restore deleted resource or folder.
     *
     * @example
     * manager.restore(3);
     */
    restore(id) {

        const item = this.trash.get(id);


        if (!item) {
            return false;
        }


        if (item.type === "resource") {

            const resource = item.data;

            this.resources.set(
                resource.path,
                resource
            );


            this.addFolder(resource.folder);

        }


        if (item.type === "folder") {

            this.folders.add(item.folder);


            for (const resource of item.resources) {

                this.resources.set(
                    resource.path,
                    resource
                );
            }
        }


        this.trash.delete(id);


        return true;
    }


    /**
     * Returns deleted items available for restore.
     *
     * @example
     * manager.getTrash();
     */
    getTrash() {

        return [...this.trash.values()]
            .map(item => ({
                id: item.id,
                type: item.type,
                deletedAt: item.deletedAt
            }));
    }


    /**
     * Permanently remove all deleted items.
     */
    clearTrash() {

        this.trash.clear();
    }

}