'use strict';

const fs = require('node:fs');

function hackEslintPackageJson() {
    console.log(`------ Eslint Summary: Begin Patch -----`)
    const eslintPackageJsonPath = require.resolve('eslint/package.json');
    const packageJson = JSON.parse(fs.readFileSync(eslintPackageJsonPath).toString());

    packageJson.exports['./cli-engine'] = `./lib/cli-engine/cli-engine.js`;

    fs.writeFileSync(eslintPackageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`------ Eslint Summary: Patched -----`)
}

hackEslintPackageJson();
