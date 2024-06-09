'use strict';

const fs = require('fs').promises;
const path = require('path');

/**
 * Creates a file with the specified name and data.
 * @param {string} fileName The name of the file.
 * @param {string} [data=''] The data to write to the file (default is an empty string).
 * @returns {Promise<void>} A promise that resolves after the file is successfully created.
 */
async function createFile(fileName, data = '') {
    return await fs.writeFile(fileName, data);
}

/**
 * Deletes a file with the specified name.
 * @param {string} fileName The name of the file to delete.
 * @returns {Promise<void>} A promise that resolves after the file is successfully deleted.
 */
async function deleteFile(fileName) {
    return await fs.unlink(fileName);
}

/**
 * Creates a test file name with the specified extension.
 * @param {string} [ext='ts'] The extension of the file (default is 'ts').
 * @returns {string} The test file name.
 */
function createTestFileName(ext = 'ts') {
    return `.__sample-file.${ext}`;
}

/**
 * Reads the contents of a directory at the specified path.
 * @param {string} configPath The path to the directory.
 * @returns {Promise<string[]>} A promise that resolves with an array of file names in the directory.
 */
async function readDir(configPath) {
    return await fs.readdir(configPath);
}

/**
 * Normalizes a file name by removing its extension.
 * @param {string} fileName The file name to normalize.
 * @returns {string} The normalized file name.
 */
function normalizeConfigName(fileName) {
    return fileName.slice(0, fileName.lastIndexOf('.'));
}

/**
 * Creates a JSON file with the specified name containing rules information.
 * @param {string} fileName The name of the JSON file.
 * @param {Object} rulesInfo The information about the rules.
 * @param {string} [filePath='.'] The path to the directory where the file should be created (default is the current directory).
 * @returns {Promise<void>} A promise that resolves after the JSON file is successfully created.
 */
// async function createResultJson(fileName, rulesInfo, filePath = '.') {
//     return createFile(path.join(filePath, `${fileName}.json`), JSON.stringify(rulesInfo));
// }

/**
 * Creates a document file with the specified name and Markdown content.
 * @param {string} configRelativePath The name of the document file.
 * @param {string} markdown The Markdown content.
 * @param {string} [outputPath='.'] The path to the directory where the file should be created (default is the current directory).
 * @returns {Promise<void>} A promise that resolves after the document file is successfully created.
 */
async function createResultDoc(configRelativePath, markdown, outputPath = '.') {
    const segments = configRelativePath.split('/');

    if(segments.length > 1){
        outputPath = path.join(outputPath, ...segments.slice(0, segments.length - 1))
        configRelativePath = segments.at(-1);
    }

    if (outputPath.split('/').length > 1) {
        await fs.mkdir(outputPath, { recursive: true });
    }

    return createFile(path.join(outputPath, `${configRelativePath}.md`), markdown);
}

module.exports = {
    createFile,
    deleteFile,
    createTestFileName,
    readDir,
    // createResultJson,
    createResultDoc,
};
