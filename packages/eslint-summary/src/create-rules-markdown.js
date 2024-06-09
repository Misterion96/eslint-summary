const { Markdown } = require('./markdown');

/**
 * Creates a Markdown document based on the provided plugin configuration.
 * @param {Object} pluginConfig The configuration object for the plugins and their rules.
 * @returns {string} The generated Markdown document.
 */
function createMarkdown(pluginConfig) {
    const markDownInstance = new Markdown();

    const navigationList = [];
    const articles = [];

    for (const [pluginName, pluginInfo] of Object.entries(pluginConfig).sort(sortEntries)) {
        navigationList.push(markDownInstance.link(pluginName, prepareAnchor(pluginName)));
        articles.push(createArticle(markDownInstance, pluginName, pluginInfo));
    }

    return [
        markDownInstance.header('Navigation'),
        markDownInstance.unorderedList(navigationList),
        ...articles,
    ].join('\n');
}

/**
 * Creates a Markdown article for a plugin.
 * @param {Markdown} markDownInstance An instance of the Markdown class.
 * @param {string} pluginName The name of the plugin.
 * @param {PluginInfo} pluginInfo Information about the plugin and its rules.
 * @returns {string} The Markdown article for the plugin.
 */
function createArticle(markDownInstance, pluginName, pluginInfo) {
    const { rules, fields, extensions } = pluginInfo;

    const header = markDownInstance.header(pluginName, 2);
    const table = createTable(markDownInstance, rules, fields, extensions);

    return [header, table].join('\n');
}

const DEFAULT_TABLE_COLUMNS = [{ title: 'Rule', key: 'rule' }];

/**
 * Creates a Markdown table for the rules of a plugin.
 * @param {Markdown} markDownInstance An instance of the Markdown class.
 * @param {Object} rules The rules of the plugin.
 * @param {string[]} fields Additional fields for the table columns.
 * @param {string[]} extensions Additional extensions for the table columns.
 * @returns {string} The Markdown table for the plugin rules.
 */

function createTable(markDownInstance, rules, fields, extensions) {
    const fieldCols = createAdditionalColByFields(fields);
    const extensionCols = createAdditionalColByExtensions(extensions);

    const columns = [
        ...DEFAULT_TABLE_COLUMNS,
        ...extensionCols,
        ...fieldCols,
    ];

    const headerRow = markDownInstance.tableHeaderRow(columns);
    const colsAlignRow = markDownInstance.tableBreakRow(columns);

    const tableBodyRows = Object.entries(rules)
        .sort(sortEntries)
        .map(([ruleName, ruleMeta]) => {
            const rowData = createRowRuleData(markDownInstance, ruleName, ruleMeta);

            return markDownInstance.tableRow(columns, rowData);
        });

    return [
        headerRow,
        colsAlignRow,
        ...tableBodyRows,
    ].join('\n');
}

/**
 * Creates the data for a row of the Markdown table.
 * @param {Markdown} markDownInstance An instance of the Markdown class.
 * @param {string} ruleName The name of the rule.
 * @param {Object} ruleMeta Information about the rule.
 * @returns {Object} The data for the row of the Markdown table.
 */
function createRowRuleData(markDownInstance, ruleName, ruleMeta) {
    const info = ruleMeta.getInfo();
    const { description, url } = info;

    const extensions = ruleMeta.getExtensionList();
    const rule = markDownInstance.link(ruleName, url);

    const mappedExt = extensions.reduce((acc, ext) => {
        acc[ext] = markDownInstance.code(prepareRuleOptions(info[ext]));

        return acc;
    }, {});

    return {
        ...info,
        ...mappedExt,
        rule,
        description: prepareDescription(description),
    };
}

/**
 * Creates additional table columns based on the extensions.
 * @param {string[]} extensions The extensions for which additional columns are needed.
 * @returns {{key: string; title: string;}[]} The additional columns for the Markdown table.
 */
function createAdditionalColByExtensions(extensions = []) {
    return extensions.map(ext => {
        return {
            title: `Extension *.${ext}`,
            key: ext,
        };
    });
}

/**
 * Creates additional table columns based on the fields.
 * @param {string[]} fields The fields for which additional columns are needed.
 * @returns {{key: string; title: string;}[]} The additional columns for the Markdown table.
 */
function createAdditionalColByFields(fields) {
    return fields.map(field => ({ title: field, key: field }));
}

/**
 * Prepares an anchor for a plugin name.
 * @param {string} pluginName The name of the plugin.
 * @returns {string} The prepared anchor.
 */
function prepareAnchor(pluginName) {
    return `#${pluginName.replace(/[/@]+/g, '')}`;
}

/**
 * Prepares rule options for display.
 * @param {*} options The options to prepare.
 * @returns {string|null} The prepared options.
 */
function prepareRuleOptions(options) {
    return options ? JSON.stringify(options).replace(/\|/gi, '\\|') : null;
}

/**
 * Prepares description for display.
 * @param {string} description The description to prepare.
 * @returns {string} The prepared description.
 */
function prepareDescription(description = '') {
    return description ? description.replace(/\n+/, '') : '';
}

/**
 * Sorts entries alphabetically.
 * @param {string[]} ruleName1 The first rule name.
 * @param {string[]} ruleName2 The second rule name.
 * @returns {number} The comparison result.
 */
function sortEntries(ruleName1, ruleName2) {
    if (ruleName1 > ruleName2) {
        return 1;
    }
    if (ruleName2 > ruleName1) {
        return -1;
    }

    return 0;
}

module.exports = createMarkdown;
