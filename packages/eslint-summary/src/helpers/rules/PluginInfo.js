const RuleInfo = require('./RuleInfo');

/**
 * Represents information about a plugin.
 */
module.exports = class PluginInfo {
    /**
     * The set of fields to exclude from tracking.
     * @type {Set<string>}
     * @private
     */
    #excludeFields = new Set();
    /**
     * The set of fields to exclude from tracking.
     * @type {Set<string>}
     * @private
     */
    #fields = new Set();
    /**
     * The set of fields to exclude from tracking.
     * @type {Set}
     * @private
     */
    #extensions = new Set();
    /**
     * The set of fields to exclude from tracking.
     * @type {Object}
     * @private
     */
    #rules = {};

    /**
     * Constructs a new PluginInfo instance.
     * @param {Set} [excludeFields=new Set()] The fields to exclude from tracking.
     */
    constructor(excludeFields = new Set()) {
        this.#excludeFields = excludeFields;
    }

    /**
     * The fields tracked by the plugin.
     * @type {string[]}
     */
    get fields() {
        return Array.from(this.#fields.values());
    }

    /**
     * The extensions tracked by the plugin.
     * @type {string[]}
     */
    get extensions() {
        return Array.from(this.#extensions.values());
    }

    get rules() {
        return this.#rules;
    }

    /**
     * Checks if a rule exists in the plugin.
     * @param {string} ruleName The name of the rule.
     * @returns {boolean} true if the rule exists, otherwise false.
     */
    hasRule(ruleName) {
        return !!this.#rules[ruleName];
    }

    /**
     * Adds a rule to the plugin.
     * @param {string} ruleName The name of the rule.
     * @param {RuleInfo} ruleInfo Information about the rule.
     */
    addRule(ruleName, ruleInfo) {
        this.#setFields(ruleInfo);
        this.#rules[ruleName] = new RuleInfo(ruleName, ruleInfo);
    }

    /**
     * Adds an extension to a rule in the plugin.
     * @param {string} extension The extension to add.
     * @param {string} ruleName The name of the rule.
     * @param {[string, string?]} ruleSettings The settings associated with the rule.
     */
    addExtension(extension, ruleName, ruleSettings) {
        this.#extensions.add(extension);
        this.#rules[ruleName].addExtension(extension, ruleSettings);
    }

    /**
     * Returns a JSON representation of the plugin information.
     * @returns {Object} JSON representation of the plugin information.
     */
    toJSON() {
        return {
            fields: this.fields,
            rules: this.#rules,
        };
    }

    /**
     * Sets the fields tracked by the plugin.
     * @param {Object} ruleInfo Information about the rule.
     * @private
     */
    #setFields(ruleInfo) {
        const { schema, messages, ...restInfo } = ruleInfo;

        Object.keys({
            ...restInfo,
            ...(restInfo.docs || {}),
        }).forEach(field => (!this.#excludeFields.has(field) ? this.#fields.add(field) : null));
    }
};
