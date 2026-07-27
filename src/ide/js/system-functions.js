/**
 * Generates a unique UUID v4 identifier for a page
 * @returns {string} A unique UUID v4 string in the format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 * @example
 * const pageId = generatePageId();
 * console.log(pageId); // "550e8400-e29b-41d4-a716-446655440000"
 */
function generateHashId() {
    return 'xxxxxxxx-xxxx-2xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function generateCommandId() {
    return 'com-yxxx-xxxxx'.replace(/[xy]/g, function (c) {
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

let safeClone = function (Object) {
    try {
        return structuredClone(Object);
    } catch {
        return JSON.parse(JSON.stringify(Object));
    }

}
/**
 * getInstance for edited entity to redo/undo direct
 * @param command UndoCommand
 * @param state ProjectState
 * @returns {*} object of [project|page|component]
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
}

async function createBlankImageBlob() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 1, 1);

    return await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}


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