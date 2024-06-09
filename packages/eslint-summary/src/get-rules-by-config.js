const { createTestFileName, createFile, deleteFile } = require('./helpers/fs');
const { parseFullRuleName, RuleInfo, PluginInfo } = require('./helpers/rules');
const { createCliEngine } = require('./eslint-api');

const excludeFields = new Set([
    'docs',
    'url',
    'extensions',
]);

/**
 * Gets rules for a specific extension.
 * @param {string} configFile The ESLint configuration object.
 * @param {string} extension The file extension to get rules for.
 * @param {{[pluginName: string]: PluginInfo}} pluginsMap A map to store plugins and their rules.
 * @param {string[]} [ignorePlugins=[]] Plugins to ignore.
 * @returns {Promise<void>} A promise that resolves when rules are obtained.
 */
async function getRulesByExtension(configFile, extension, pluginsMap, ignorePlugins = []) {
    const cliEngine = createCliEngine(configFile, extension);
    const globalRulesMap = cliEngine.getRules();

    const testFileName = createTestFileName(extension);
    await createFile(testFileName);

    const { rules } = cliEngine.getConfigForFile(testFileName, extension);

    for (const [fullRuleName, ruleSettings] of Object.entries(rules)) {
        const { pluginName, rule } = parseFullRuleName(fullRuleName);

        if (ignorePlugins.includes(pluginName) && pluginName !== 'eslint') {
            continue;
        }

        if (!pluginsMap[pluginName]) {
            pluginsMap[pluginName] = new PluginInfo(excludeFields);
        }

        if (!pluginsMap[pluginName].hasRule(rule)) {
            const ruleMetaInfo = globalRulesMap.get(fullRuleName)?.meta || {};
            pluginsMap[pluginName].addRule(rule, new RuleInfo(rule, ruleMetaInfo));
        }

        pluginsMap[pluginName].addExtension(extension, rule, ruleSettings);
    }

    await deleteFile(testFileName);
}

/**
 * Gets rules for multiple extensions.
 * @param {string} configFile The ESLint configuration object.
 * @param {string[]} extensions The file extensions to get rules for.
 * @param {string[]} [ignorePlugins=[]] Plugins to ignore.
 * @returns {Promise<{[pluginName: string]: PluginInfo}>} A promise that resolves with the rules map.
 */
async function getRulesByConfig(configFile, extensions, ignorePlugins = []) {
    const result = {};
    for (const ext of extensions) {
        await getRulesByExtension(configFile, ext, result, ignorePlugins);
    }

    return result;
}

module.exports = getRulesByConfig;
