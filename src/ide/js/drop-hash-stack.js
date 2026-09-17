/**
 * A stack that allows removing an item by its hash
 * while preserving the order of the remaining items.
 */
class DropHashStack {
    _stack = [];

    /**
     * Adds a hash to the top of the stack.
     *
     * @param {string} hash - Hash to add.
     * @returns {DropHashStack} The current stack instance.
     */
    push(hash) {
        this._stack.push(hash);

        return this;
    }

    /**
     * Removes the first occurrence of a hash from the stack.
     *
     * The relative order of all remaining hashes is preserved.
     *
     * @param {string} hash - Hash to remove.
     * @returns {boolean} True if the hash was found and removed.
     */
    pop(hash) {
        const index = this._stack.indexOf(hash);

        if (index === -1) {
            return false;
        }

        this._stack.splice(index, 1);

        return true;
    }

    /**
     * Returns the hash at the top of the stack.
     *
     * @returns {string|undefined} The top hash, or undefined if empty.
     */
    last() {
        return this._stack.at(-1);
    }

    /**
     * Returns a copy of the complete stack data.
     *
     * @returns {string[]} A copy of the stack.
     */
    map() {
        return [...this._stack];
    }
}

let dropHashStack = new DropHashStack();

export default dropHashStack;