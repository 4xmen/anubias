/**
 * hash map manager with an internal trash stack.
 * only the manager can access the trash – the rest of the app
 * interacts through `restore(hash)` which automatically decides
 * whether the hash belongs to a page or a component.
 */
export class HashMapManager {
    constructor () {
        this.pageHashMap = []          // [pageHash, …]
        this.componentHashMap = []     // [{parent, hash, type}, …]
        this._trash = []               // private stack [{kind, data}, …]
    }

    /* -----------------------------------------------------------
     * rebuild both maps from the whole project (clears trash)
     * ----------------------------------------------------------- */
    renew (project) {
        this.clear()
        for (const page of project.pages) {
            this.pageHashMap.push(page.hash)

            for (const comp of page.children.visual) {
                this.componentHashMap.push({
                    parent: page.hash,
                    hash: comp.hash,
                    type: 'visual'
                })
            }

            for (const comp of page.children.nonVisual) {
                this.componentHashMap.push({
                    parent: page.hash,
                    hash: comp.hash,
                    type: 'nonvisual'
                })
            }
        }
    }

    /* -----------------------------------------------------------
     * find component index (‑1 if not found)
     * ----------------------------------------------------------- */
    findComponentIndex (hash) {
        return this.componentHashMap.findIndex(c => c.hash === hash)
    }
    /* -----------------------------------------------------------
     * find component,page index & type (‑1 if not found)
     * ----------------------------------------------------------- */
    findComponentFullIndexes(hash, project) {
        let hashmap = this.getComponent(hash);
        let pageIndex = this.findPageIndex(hashmap.parent);
        let index = 0;
        for (const c of project.pages[pageIndex].children[hashmap.type]) {
            if (c.hash === hashmap.hash) {
                return {
                    index,
                    type: hashmap.type,
                    pageIndex,
                }
            }
            index++;
        }
        return {
            index: -1,
            type: null,
            pageIndex,
        }
        // return this.componentHashMap.findIndex(c => c.hash === hash);
    }


    /* -----------------------------------------------------------
     * find page index (‑1 if not found)
     * ----------------------------------------------------------- */
    findPageIndex (hash) {
        return this.pageHashMap.findIndex(p => p === hash)
    }

    /* -----------------------------------------------------------
     * remove a component – pushes it to the hidden trash
     * ----------------------------------------------------------- */
    removeComponent (hash) {
        const idx = this.findComponentIndex(hash)
        if (idx !== -1) {
            const removed = this.componentHashMap.splice(idx, 1)[0]
            this._trash.push({ kind: 'component', data: removed })
            return true
        }
        return false
    }

    /* -----------------------------------------------------------
     * add a component (caller avoids duplicates)
     * ----------------------------------------------------------- */
    addComponent ({ parent, hash, type }) {
        this.componentHashMap.push({ parent, hash, type })
    }

    /* -----------------------------------------------------------
     * page helpers
     * ----------------------------------------------------------- */
    hasPage (hash) {
        return this.pageHashMap.includes(hash)
    }

    addPage (hash) {
        this.pageHashMap.push(hash)
    }

    removePage (hash) {
        const idx = this.pageHashMap.indexOf(hash)
        if (idx !== -1) {
            const removed = this.pageHashMap.splice(idx, 1)[0]
            this._trash.push({ kind: 'page', data: removed })
        }

        // also move its components to trash
        const comps = this.componentHashMap.filter(c => c.parent === hash)
        this.componentHashMap = this.componentHashMap.filter(c => c.parent !== hash)
        comps.forEach(c => this._trash.push({ kind: 'component', data: c }))
    }

    /* -----------------------------------------------------------
     * clear everything (including trash)
     * ----------------------------------------------------------- */
    clear () {
        this.pageHashMap = []
        this.componentHashMap = []
        this._trash = []
    }

    /* -----------------------------------------------------------
     * restore an item that was previously removed.
     * the method looks into the internal trash, determines whether
     * the stored hash is a page or a component and puts it back.
     *
     * returns true if something was restored, false otherwise.
     * ----------------------------------------------------------- */
    restore (hash) {
        // find the most recent trash entry that matches the hash
        for (let i = this._trash.length - 1; i >= 0; i--) {
            const entry = this._trash[i]
            const dataHash = entry.kind === 'page' ? entry.data : entry.data.hash

            if (dataHash === hash) {
                // remove from trash
                this._trash.splice(i, 1)

                // put back into the proper map
                if (entry.kind === 'page') {
                    this.pageHashMap.push(entry.data)
                } else {
                    this.componentHashMap.push(entry.data)
                }
                return true
            }
        }
        return false // hash not found in trash
    }


 /* -----------------------------------------------------------
  * get the component object for a given hash.
  * returns the component entry or undefined if not found.
  * ----------------------------------------------------------- */
    getComponent (hash) {
        return this.componentHashMap.find(c => c.hash === hash)
    }

    /* -----------------------------------------------------------
     * get the page hash (or page data) for a given hash.
     * since pages are stored as simple hashes, this returns the
     * hash if it exists, otherwise undefined.
     * ----------------------------------------------------------- */
    getPage (hash) {
        return this.pageHashMap.includes(hash) ? hash : undefined
    }
}
