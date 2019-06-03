/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const path = require('path');
const typescript = require('rollup-plugin-typescript');

const { version } = require('../../package.json');
const { generateTargetName } = require('./util');

const entry = path.resolve(__dirname, '../../src/index.ts');
const modulesDirectory = path.resolve(__dirname, '../../dist/modules');

const banner = ``;
const footer = `/** version: ${version} */`;

function rollupConfig(config) {
    const { format, target } = config;

    const targetName = generateTargetName(config);
    const targetDirectory = modulesDirectory + `/${target}`;

    return {
        input: entry,
        output: {
            file: path.join(targetDirectory, targetName),
            name: 'ReactiveService',
            format,
            banner,
            footer,
        },
        plugins: [typescript({ target, typescript: require('typescript') })],
    };
}

module.exports = [rollupConfig({ format: 'es', target: 'es2017' })];
