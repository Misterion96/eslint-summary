#!/usr/bin/env node

const { findAndReadConfig } = require('read-config-file');

/**
 * Catch and report unexpected error.
 * @param {any} error The thrown error object.
 * @returns {void}
 */

function onFatalError(error) {
    process.exitCode = 2;

    const { version } = require('../package.json');
    console.error(`
Oops! Something went wrong! :(

ESLint Summary: ${version}

${error}`);
}

async function readConfigFile() {
    const CONFIG_NAME = '.eslint-summary';

    try {
        const { result } = await findAndReadConfig({
            configFilename: CONFIG_NAME,
            projectDir: process.cwd(),
        });

        return result;
    } catch (e) {
        console.warn(e);
        return {};
    }
}

(async function main() {
    process.on('uncaughtException', onFatalError);
    process.on('unhandledRejection', onFatalError);

    const EslintSummary = require('../src/index');
    void new EslintSummary(await readConfigFile()).run();
})().catch(onFatalError);
