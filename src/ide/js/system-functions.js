/**
 * Generates a unique UUID v4 identifier for a page
 * @returns {string} A unique UUID v4 string in the format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 * @example
 * const pageId = generatePageId();
 * console.log(pageId); // "550e8400-e29b-41d4-a716-446655440000"
 */
function generateHashId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

async function inspectBlob(blob, label = '') {
    if (!blob) {
        console.warn(`${label}: Blob is null/undefined`);
        return;
    }

    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    console.group(`📊 Blob Inspection: ${label} (size: ${bytes.length})`);
    console.log('First 3 bytes :', Array.from(bytes.slice(0, 3)));
    console.log('Last 3 bytes  :', Array.from(bytes.slice(-3)));

    // hex preview
    console.log('First 6 bytes (hex):',
        Array.from(bytes.slice(0, 6))
            .map(b => b.toString(16).padStart(2, '0'))
            .join(' ')
    );
    console.groupEnd();

    return bytes;
}

/**
 * get unix timestamp
 * @returns {number}
 */
let unixTimestamp = function () {
    return Math.round(+new Date() / 1000);
};
let fixName = function (filePath) {
    const hasExt = /\.[^\/\\]+$/.test(filePath);
    if (!hasExt) return filePath + ".anb";
    return filePath;
}


export { generateHashId, inspectBlob, unixTimestamp, fixName };