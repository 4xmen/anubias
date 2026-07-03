/**
 * Generates a unique UUID v4 identifier for a page
 * @returns {string} A unique UUID v4 string in the format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 * @example
 * const pageId = generatePageId();
 * console.log(pageId); // "550e8400-e29b-41d4-a716-446655440000"
 */
function generatePageId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export { generatePageId };