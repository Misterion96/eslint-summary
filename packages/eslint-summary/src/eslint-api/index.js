'use strict';

const config = {
    allowInlineConfig: true,
    baseConfig: null,
    cache: false,
    cacheLocation: '.eslintcache',
    cacheStrategy: 'metadata',
    errorOnUnmatchedPattern: true,
    fix: false,
    fixTypes: null,
    globInputPaths: true,
    ignore: true,
    ignorePath: null,
    reportUnusedDisableDirectives: null,
    resolvePluginsRelativeTo: null,
    rulePaths: [],
    useEslintrc: false,
};

/**
 * Creates a CLIEngine instance for running eslint with the specified configuration parameters.
 * @param {string} configFile The path to the eslint configuration file.
 * @param {string} extension The file extension to be processed by eslint.
 * @returns {Object} An instance of CLIEngine.
 */
function createCliEngine(configFile, extension) {
    const { CLIEngine } = require('eslint/cli-engine');

    return new CLIEngine({
        ...config,
        configFile,
        extensions: [extension],
    });
}

module.exports = {
    createCliEngine,
};
