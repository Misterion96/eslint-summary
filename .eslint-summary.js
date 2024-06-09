/**
 * @type {import('eslint-summary').EslintSummaryConfig}
 */
module.exports = {
    extensions: [
        'ts',
        'tsx',
        'html',
    ],
    configs: [
        './example-apps/angular/.eslintrc.js',
        './example-apps/next/.eslintrc.json'
    ],
};
