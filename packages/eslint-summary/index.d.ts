export interface EslintSummaryConfig {
    /**
     * The file extensions to consider
     * @example ['js', 'ts', 'html']
     * @default ['js']
     */
    extensions?: string[];
    /**
     * The eslint-plugins to ignore
     * @example ['eslint-plugin-vue']
     * @default ['']
     */
    ignorePlugins?: string[];
    /**
     * The output directory for generated summaries
     * @example 'my-directory'
     * @default 'eslint-summary-report'
     */
    output?: string;
    /**
     * The paths to ESLint configuration files
     * @example ['./.eslintrc.strict.js', 'eslint/index.js']
     * @default ['./.eslintrc.js']
     */
    configs?: string[];
}
