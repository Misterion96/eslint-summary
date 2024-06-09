/**
 * Normalizes a rule name by extracting the plugin name and rule name from the given rule string.
 * @param {string} rule The rule string in the format [pluginName/]ruleName.
 * @returns {{ pluginName: string, rule: string }} An object containing the normalized plugin name and rule name.
 */
module.exports = function (rule) {
    const ruleParts = rule.split('/');

    if (ruleParts.length === 1) {
        return {
            pluginName: 'eslint',
            rule: rule,
        };
    }

    const pluginName = ruleParts[0];
    const ruleName = ruleParts[ruleParts.length - 1];

    if (!pluginName.match('@')) {
        return {
            pluginName: `eslint-plugin-${pluginName}`,
            rule: ruleName,
        };
    }

    const segments = ruleParts.slice(1, -1);

    const secondPackage =
        segments.length > 0 ? `eslint-plugin-${segments.join('/')}` : 'eslint-plugin';

    return {
        rule: ruleName,
        pluginName: `${pluginName}/${secondPackage}`,
    };
};
