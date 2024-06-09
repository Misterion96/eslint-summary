'use strict';

const { createResultDoc,
    // createResultJson
} = require('./helpers/fs');
const getRulesByConfig = require('./get-rules-by-config');
const createMarkdown = require('./create-rules-markdown');
const path = require('node:path');

const DEFAULT_OPTIONS = {
    generateJson: false,
    extensions: [
        'js',
    ],
    ignorePlugins: [],
    output: 'eslint-summary-report',
    configs: ['./.eslintrc.js'],
};

module.exports = class EslintSummary {
    #options = DEFAULT_OPTIONS;

    /**
     * Constructs a new instance of EslintSummary with the specified options.
     * @param {Object} options The options for EslintSummary.
     * @param {boolean} [options.generateJson=false] Whether to generate JSON summaries.
     * @param {string[]} [options.extensions=['js', 'ts', 'html']] The file extensions to consider.
     * @param {string[]} [options.ignorePlugins=[]] The plugins to ignore.
     * @param {string} [options.output='docs'] The output directory for generated summaries.
     * @param {string[]} [options.configs=['./.eslintrc.js']] The paths to ESLint configuration files.
     */

    constructor(options) {
        this.#options = {
            ...DEFAULT_OPTIONS,
            ...options,
        };
    }

    async run() {
        const configFilePaths = this.#options.configs.map(config =>
            path.resolve(process.cwd(), config),
        );
        const outputPath = path.resolve(process.cwd(), this.#options.output);
        const extensions = this.#options.extensions;

        console.log('run');

        for (const configFilePath of configFilePaths) {
            const rulesInfo = await getRulesByConfig(
                configFilePath,
                extensions,
                this.#options.ignorePlugins,
            );

            const configRelativePath = path.relative(process.cwd(), configFilePath);

            // TODO
            // if (this.#options.generateJson) {
            //     await createResultJson(normalizedName, rulesInfo, outputPath);
            // }

            await createResultDoc(configRelativePath, createMarkdown(rulesInfo), outputPath);
            console.log(
                `Doc created for ${configRelativePath} in ${outputPath}`,
            );
        }
    }
};
