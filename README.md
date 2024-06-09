# Overview
This package generates a markdown file summarizing the current configuration for each plugin and the rules involved in it. The goal is to provide detailed information about each rule, including its purpose, autofix support, and applicable files, as if you were viewing the plugin's documentation page.

![usage.gif](./docs/usage.gif)

# Installation

To install the package, use the following npm command:

```sh
npm i --save-dev @dolgikh-maks/eslint-summary
```


# Launch

If you are using the `.eslintrc.js` file as your base configuration, no additional setup is required. Simply run the following command:

```sh
eslint-summary
```
After running this command, an `eslint-summary-report` directory will be created containing the `.eslintrc.md` file.


# Report File

The generated `.eslintrc.md` file will contain summary tables for each plugin used in the `.eslintrc.js` config. The report includes reserved columns such as:

- **Rule**: The name of the rule from an ESLint plugin.
- **Extension *.<extension>**: Shows the settings for each file extension.

Additional columns display metadata from the rules. If you want to learn more about a rule, simply select the rule's name in the table to follow a direct link to its documentation.


# Configuration

The `.eslint-summary.<js|json|ts|yaml>` config file allows easy configuration of the package. You can specify various options to customize report generation if the default settings are not sufficient.

### Extensions
**Default**: `['js']`

Specify the file extensions to display rule settings for each file type in the report. This is useful if your project contains different file types and you want to understand how rules apply to these extensions. Note that specifying any value will overwrite the current `[js]` setting, so include `js` if you want to keep it.

```js
/**
 * @type {import('eslint-summary').EslintSummaryConfig}
 */
module.exports = {
   extensions: ['json', 'spec.js', 'js'],
};
```

### Output Directory
**Default**: `eslint-summary-report`

Change the path of the report directory. Supports nested directories. If the specified directory does not exist at the time of generation, it will be created.

```js
/**
 * @type {import('eslint-summary').EslintSummaryConfig}
 */
module.exports = {
   output: './docs/eslint-summary',
};
```

### Ignoring Plugins
**Default**: `[]`

Exclude specific plugins from your report. This can be useful if certain third-party plugins are included in your configuration but are not relevant to your code analysis.

```js
/**
 * @type {import('eslint-summary').EslintSummaryConfig}
 */
module.exports = {
   ignorePlugins: ['eslint-plugin-vue', 'eslint-plugin-flowtype'],
};
```

### Configurations
**Default**: `['./.eslintrc.js']`

Specify ESLint configuration files that you want to analyze and generate documentation for. If your configuration file has a different name or if you have multiple configs, you can list them here.

```js
/**
 * @type {import('eslint-summary').EslintSummaryConfig}
 */
module.exports = {
   configs: [
       './example-apps/angular/.eslintrc.js',
       './example-apps/next/.eslintrc.json',
   ],
};
```

The generator will create a separate report for each configuration, named according to its location.
