/**
 * Represents information about a rule.
 */
module.exports = class RuleInfo {
    /**
     * Constructs a new RuleInfo instance.
     * @param {string} name The name of the rule.
     * @param {Object} [meta={}] Additional metadata for the rule.
     */
    constructor(name, meta = {}) {
        /**
         * The URL associated with the rule.
         * @type {string}
         */
        this.url = this.docs?.url ? this.docs?.url : this.getFallbackUrl(name);

        /**
         * The extensions associated with the rule.
         * @type {Object}
         */
        this.extensions = {};

        /**
         * The documentation for the rule.
         * @type {Object}
         */
        this.docs = {};

        Object.assign(this, meta);
    }

    /**
     * Gets the list of extensions associated with the rule.
     * @returns {string[]} An array of extensions.
     */
    getExtensionList() {
        return Object.keys(this.extensions);
    }

    /**
     * Adds an extension to the rule.
     * @param {string} ext The extension to add.
     * @param {[string, string?]} state The state associated with the extension.
     */
    addExtension(ext, state) {
        this.extensions[ext] = state;
    }

    /**
     * Gets information about the rule.
     * @returns {Object} Information about the rule.
     */
    getInfo() {
        const extensions = Object.entries(this.extensions).reduce((acc, [ext, value]) => {
            const [severity, options] = value;
            acc[ext] =
                value.length === 2
                    ? {
                          severity,
                          options,
                      }
                    : { severity };

            return acc;
        }, {});

        const obj = Object.assign({}, this, {
            ...this.docs,
            ...extensions,
        });
        delete obj['docs'];
        delete obj['extensions'];

        return obj;
    }

    /**
     * Returns a JSON representation of the rule information.
     * @returns {Object} JSON representation of the rule information.
     */
    toJSON() {
        return this.getInfo();
    }

    /**
     * Returns a fallback URL based on the rule name.
     * @param {string} name The name of the rule.
     * @returns {string} The fallback URL.
     */
    getFallbackUrl(name) {
        return `https://www.google.com/search?q=${name}`;
    }
};
