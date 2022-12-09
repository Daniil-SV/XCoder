#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const yargs_1 = require("yargs");
const helpers_1 = require("yargs/helpers");
const console_1 = require("../lib/console");
const textures_1 = require("../lib/features/textures");
const locale_1 = require("../lib/locale");
const { argv } = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv));
const inPath = argv['input'] || argv['i'];
const outPath = argv['output'] || argv['o'];
locale_1.locale.initialize();
if ((0, fs_1.existsSync)(inPath)) {
    const stat = (0, fs_1.lstatSync)(inPath);
    if (stat.isDirectory()) {
        (0, textures_1.textureEncode)(inPath, outPath ? outPath : inPath + '.sc');
    }
}
else {
    (0, console_1.trace)(locale_1.locale['wrongInputFile'], { textColor: console_1.colors.red });
}
