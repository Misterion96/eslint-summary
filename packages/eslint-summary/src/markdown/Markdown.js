'use strict';

/**
 * Represents a utility class for generating Markdown syntax.
 */
module.exports = class Markdown {
    /**
     * Generates a Markdown link.
     * @param {string} [title=''] The title of the link.
     * @param {string} [link=''] The URL of the link.
     * @returns {string} The Markdown link.
     */
    link(title = '', link = '') {
        return `[${title}](${link})`;
    }

    /**
     * Generates a Markdown paragraph.
     * @param {string} [value=''] The content of the paragraph.
     * @returns {string} The Markdown paragraph.
     */
    paragraph(value = '') {
        return `${value}\n`;
    }

    /**
     * Generates a Markdown table.
     * @param {{key: string; title?: string; align?: 'left' | 'right' | 'center'}[]} columns The columns of the table.
     * @param {Object[]} rows The rows of the table.
     * @returns {string} The Markdown table.
     */
    table(columns = [], rows = []) {
        const tableHeaderRow = this.tableHeaderRow(columns);
        const breakHeadRow = this.tableBreakRow(columns);
        const tableRows = rows.map(rowData => this.tableRow(columns, rowData));

        return [
            tableHeaderRow,
            breakHeadRow,
            ...tableRows,
        ].join('\n');
    }

    /**
     * Generates the header row of a Markdown table.
     * @param {{key: string; title?: string; align?: 'left' | 'right' | 'center'}[]} [cols=[]] The columns of the table.
     * @returns {string} The header row of the Markdown table.
     */
    tableHeaderRow(cols = []) {
        return this.#joinCells(cols.map(col => this.tableCell(col.title)));
    }

    /**
     * Generates a row of a Markdown table.
     * @param {{key: string; title?: string; align?: 'left' | 'right' | 'center'}[]} [cols=[]] The columns of the table.
     * @param {Object} [rowData={}] The data for the row.
     * @returns {string} A row of the Markdown table.
     */
    tableRow(cols = [], rowData = {}) {
        return this.#joinCells(this.tableRowCells(cols, rowData));
    }

    /**
     * Generates the break row of a Markdown table.
     * @param {{key: string; title?: string; align?: 'left' | 'right' | 'center'}[]} [cols=[]] The columns of the table.
     * @returns {string} The break row of the Markdown table.
     */
    tableBreakRow(cols = []) {
        return this.#joinCells(this.tableBreakCells(cols));
    }

    /**
     * Generates the cells for a row of a Markdown table.
     * @param {{key: string}[]} [cols=[]] The columns of the table.
     * @param {Object} [rowData={}] The data for the row.
     * @returns {string[]} The cells for the row of the Markdown table.
     */
    tableRowCells(cols = [], rowData = {}) {
        return cols.map(col => this.tableCell(rowData[col.key]));
    }

    /**
     * Generates the cells for the break row of a Markdown table.
     * @param {{title?: string; align?: 'left' | 'right' | 'center'}[]} [cols=[]] The columns of the table.
     * @returns {string[]} The cells for the break row of the Markdown table.
     */
    tableBreakCells(cols = []) {
        return cols.map(col => this.tableAlignCell(col.title?.length, col.align));
    }

    /**
     * Joins an array of cells into a single string.
     * @param {string[]} [cells=[]] The cells to join.
     * @returns {string} The joined cells.
     * @private
     */
    #joinCells(cells = []) {
        return cells.join('').replace(/\|\|/g, '|');
    }

    /**
     * Generates a Markdown table cell.
     * @param {string} [value=''] The content of the cell.
     * @returns {string} The Markdown table cell.
     */
    tableCell(value = '') {
        return `| ${value} |`;
    }

    /**
     * Generates a Markdown table alignment cell.
     * @param {number} [length=0] The length of the content in the cell.
     * @param {'left' | 'right' | 'center'} [align=''] The alignment of the cell content.
     * @returns {string} The Markdown table alignment cell.
     */
    tableAlignCell(length = 0, align) {
        const minLength = length < 3 ? 3 : length;
        const dashes = '-'.repeat(minLength);

        switch (align) {
            case 'left': {
                return `|:${dashes}|`;
            }
            case 'right': {
                return `|${dashes}:|`;
            }
            case 'center': {
                return `|:${dashes}:|`;
            }
            default: {
                return `|${dashes}|`;
            }
        }
    }

    /**
     * Generates a Markdown header.
     * @param {string} [value=''] The content of the header.
     * @param {number} [level=1] The level of the header.
     * @returns {string} The Markdown header.
     */
    header(value = '', level = 1) {
        return `${'#'.repeat(level)} ${value}\n`;
    }

    /**
     * Generates a Markdown code block.
     * @param {string} [code=''] The code to display in the code block.
     * @returns {string} The Markdown code block.
     */
    code(code = '') {
        return `\`${code}\``;
    }

    /**
     * Generates an unordered list in Markdown.
     * @param {string[]} array The array of items for the list.
     * @param {string} [lineItem='-'] The character to use for each line item.
     * @returns {string} The Markdown unordered list.
     */
    unorderedList(array, lineItem = '-') {
        return array.map(item => `${lineItem} ${item}`).join('\n');
    }

    /**
     * Makes text bold in Markdown.
     * @param {string} text The text to make bold.
     * @returns {string} The Markdown bold text.
     */
    bold(text) {
        return `**${text}**`;
    }

    /**
     * Makes text italic in Markdown.
     * @param {string} text The text to make italic.
     * @returns {string} The Markdown italicized text.
     */
    italic(text) {
        return `*${text}*`;
    }
};
