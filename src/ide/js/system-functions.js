/**
 * Generates a unique UUID v4-style identifier (hash ID)
 * @returns {string} A unique UUID-like string in the format: xxxxxxxx-xxxx-2xxx-yxxx-xxxxxxxxxxxx
 * @example
 * const id = generateHashId();
 * console.log(id); // "550e8400-e29b-21d4-a716-446655440000"
 */
function generateHashId() {
    return 'xxxxxxxx-xxxx-2xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Generates a unique command ID
 * @returns {string} A unique command ID in the format: com-yxxx-xxxxx
 * @example
 * const commandId = generateCommandId();
 * console.log(commandId); // "com-a1b2-c3d4e"
 */
function generateCommandId() {
    return 'com-yxxx-xxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Inspects a Blob and logs detailed information about its contents
 * @param {Blob|null|undefined} blob - The Blob to inspect
 * @param {string} [label=''] - Optional label for the console output
 * @returns {Promise<Uint8Array|undefined>} The byte array of the Blob, or undefined if the Blob is null/undefined
 * @example
 * await inspectBlob(myBlob, 'Image Data');
 */
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
 * Returns the current Unix timestamp in seconds
 * @returns {number} Current Unix timestamp (seconds since epoch)
 * @example
 * const now = unixTimestamp();
 * console.log(now); // 1726380000
 */
let unixTimestamp = function () {
    return Math.round(+new Date() / 1000);
};

/**
 * Ensures a file path has an extension. Adds ".anb" if none is present
 * @param {string} filePath - The original file path
 * @returns {string} The file path with an extension
 * @example
 * fixName("document");     // "document.anb"
 * fixName("image.png");    // "image.png"
 */
let fixName = function (filePath) {
    const hasExt = /\.[^\/\\]+$/.test(filePath);
    if (!hasExt) return filePath + ".anb";
    return filePath;
};

/**
 * Creates a deep clone of an object safely.
 * Tries structuredClone first, falls back to JSON serialization.
 * @param {*} Object - The value to clone
 * @returns {*} A deep clone of the input
 * @example
 * const clone = safeClone(originalObject);
 */
let safeClone = function (Object) {
    try {
        return structuredClone(Object);
    } catch {
        return JSON.parse(JSON.stringify(Object));
    }
};

/**
 * Returns the instance of the edited entity for undo/redo operations
 * @param {Object} command - The UndoCommand object
 * @param {Object} state - The ProjectState object
 * @returns {*} The corresponding project, page, or component instance
 */
let getInstanceByCommand = function (command, state) {
    if (command.entity === "COMPONENT") {
        const {
            index,
            pageIndex,
            type
        } = state.hashmaps.findComponentFullIndexes(command.targetId, state.project);
        return state.project.pages[pageIndex].children[type][index];
    } else if (command.entity === "PAGE") {
        return state.project.pages[state.hashmaps.findPageIndex(command.targetId)];
    } else {
        // project
        return state.project;
    }
};

/**
 * Creates a 1x1 white PNG Blob
 * @returns {Promise<Blob>} A Promise that resolves to a 1x1 white PNG Blob
 * @example
 * const blankBlob = await createBlankImageBlob();
 */
async function createBlankImageBlob() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1, 1);

    return await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}

/**
 * Extracts file name and extension information from a path
 * @param {string} path - The file path
 * @returns {{name: string, ext: string, hasExtension: boolean}} Object containing name, extension, and whether an extension exists
 * @example
 * getFileInfo("folder/image.PNG");
 * // { name: "image", ext: "png", hasExtension: true }
 *
 * getFileInfo("document");
 * // { name: "document", ext: "", hasExtension: false }
 */
function getFileInfo(path) {
    const normalized = path.replace(/\\/g, "/");

    const fileName = normalized.split("/").pop() ?? "";

    const dot = fileName.lastIndexOf(".");

    if (dot <= 0) {
        return {
            name: fileName,
            ext: "",
            hasExtension: false,
        };
    }

    return {
        name: fileName.slice(0, dot),
        ext: fileName.slice(dot + 1).toLowerCase(),
        hasExtension: true,
    };
}

export {
    generateHashId,
    inspectBlob,
    unixTimestamp,
    fixName,
    generateCommandId,
    safeClone,
    getInstanceByCommand,
    createBlankImageBlob,
    getFileInfo
};