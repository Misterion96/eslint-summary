const fs = require('node:fs');
const lodash = require('lodash');
const path = require('node:path');
const { Markdown } = require('../markdown/markdown');

interface IRuleState {
    severity: 'error' | 'off' | 'warn';
    options: object;
}

function sortEntries<T extends [string, ...unknown[]]>([key1]: T, [key2]: T): number {
    if (key1 > key2) {
        return 1;
    }
    if (key2 > key1) {
        return -1;
    }

    return 0;
}

interface IPluginInfo {
    fields: string[];
    rules: {
        [ruleName: string]: {
            url: string;
            description: string;
            html: IRuleState;
            js: IRuleState;
            ts: IRuleState;
        };
    };
}

interface IEslintConfigJson {
    [plugin: string]: IPluginInfo;
}

interface IResultConfigs {
    [pluginName: string]: {
        [ruleName: string]: {
            url: string;
            description: string;
            eslintConfigs: {
                configName: string;
                states: {
                    [ext: string]: IRuleState;
                };
            }[];
        };
    };
}

interface IDiffConfigData {
    ruleName: string;
    url: string;
    description: string;
    cause: 'no for compare' | 'not equal settings';
}

type TDiffConfigs = Record<string, IDiffConfigData[]>;

async function run(configsMap: Map<string, string>): Promise<IResultConfigs> {
    const result: IResultConfigs = {};

    // @ts-expect-error: ''
    [...configsMap.keys()].forEach(configName => {
        Object.entries(require(configsMap.get(configName)) as unknown as IEslintConfigJson).forEach(
            ([pluginName, { rules }]) => {
                if (!result[pluginName]) {
                    result[pluginName] = {};
                }

                Object.entries(rules).forEach(([ruleName, { url, description, js, ts, html }]) => {
                    if (!result[pluginName][ruleName]) {
                        result[pluginName][ruleName] = {
                            url,
                            description,
                            eslintConfigs: [],
                        };
                    }

                    result[pluginName][ruleName].eslintConfigs.push({
                        configName,
                        states: {
                            js,
                            ts,
                            html,
                        },
                    });
                });
            },
        );
    });

    return result;
}

function diff(result: IResultConfigs, mapLength: number): TDiffConfigs {
    const diff: TDiffConfigs = {};

    for (const [pluginName, pluginOptions] of Object.entries(result)) {
        if (!diff[pluginName]) {
            diff[pluginName] = [];
        }

        for (const [ruleName, { url, description, eslintConfigs }] of Object.entries(
            pluginOptions,
        )) {
            const configsObj = eslintConfigs.reduce<Record<string, unknown>>(
                (acc, { configName, states }) => {
                    acc[configName] = states;

                    return acc;
                },
                {},
            );

            const diffObj = {
                ruleName,
                url,
                description,
                ...configsObj,
            };

            if (eslintConfigs.length !== mapLength) {
                diff[pluginName].push({
                    ...diffObj,
                    cause: 'no for compare',
                });
                continue;
            }

            const [base] = eslintConfigs;
            eslintConfigs.slice(1, eslintConfigs.length).forEach(config => {
                const isEqual = lodash.isEqual(config.states, base.states);

                if (!isEqual) {
                    diff[pluginName].push({
                        ...diffObj,
                        cause: 'not equal settings',
                    });
                }
            });
        }
    }

    return diff;
}

function createMarkdown(diff: TDiffConfigs): { pluginName: string; markdown: string }[] {
    const markdownService = new Markdown();
    const tableCols = [
        { title: 'External config from Maks Dolgikh', key: 'external' },
        { title: 'Local config', key: 'local' },
    ];

    return Object.entries(diff)
        .sort(sortEntries)
        .map(
            ([
                pluginName,
                pluginOptions,
            ]: [
                string,
                IDiffConfigData[],
            ]) => {
                const header = markdownService.header(pluginName, 2);
                const rules = pluginOptions
                    .map(({ url, description, cause, ruleName, ...configs }: IDiffConfigData) => {
                        const ruleHeader = markdownService.header(ruleName, 3);
                        const list = markdownService.unorderedList([
                            `${markdownService.italic('Cause')}: ${markdownService.bold(cause)}`,
                            `${markdownService.link('Link', url)}`,
                            `${markdownService.italic('Description')}: ${prepareDescription(
                                description,
                            )}`,
                        ]);

                        const preparedConfigs = Object.entries(configs).reduce<
                            Record<string, string>
                        >((acc, [configName, settings]) => {
                            acc[configName] = markdownService.code(JSON.stringify(settings));

                            return acc;
                        }, {});

                        const table = [
                            markdownService.tableHeaderRow(tableCols),
                            markdownService.tableBreakRow(tableCols),
                            markdownService.tableRow(tableCols, preparedConfigs),
                        ].join('\n');

                        return [
                            ruleHeader,
                            list,
                            '',
                            table,
                            '',
                            '***',
                        ].join('\n');
                    })
                    .join('\n');

                return {
                    pluginName,
                    markdown: [header, rules].join('\n'),
                };
            },
        );
}

function prepareDescription(description: string = ''): string {
    return description ? description.replace(/\n+/gi, '') : '';
}

const configsMap = new Map([
    ['external', `./--external.json`],
    ['local', `./--local.json`],
]);

const size: number = configsMap.size;

void run(configsMap)
    .then((result: IResultConfigs) => diff(result, size))
    .then((diff: TDiffConfigs) => {
        const diffs = createMarkdown(diff);
        for (const { pluginName, markdown } of diffs) {
            fs.writeFileSync(
                path.resolve(__dirname, `../../../docs/diffs/${pluginName.replace(/\//, '-')}.md`),
                markdown,
            );
        }
    });
