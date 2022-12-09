#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const yargs_1 = require("yargs");
const helpers_1 = require("yargs/helpers");
const console_1 = require("../lib/console");
const compression_1 = require("../lib/features/compression");
const locale_1 = require("../lib/locale");
const { argv } = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv));
const inPath = argv['input'] || argv['i'];
const outPath = argv['output'] || argv['o'];
locale_1.locale.initialize();
if ((0, fs_1.existsSync)(inPath)) {
    const stat = (0, fs_1.lstatSync)(inPath);
    if (stat.isDirectory()) {
        const outFolder = outPath || inPath + '_compressed';
        if (!(0, fs_1.existsSync)(outFolder)) {
            (0, fs_1.mkdirSync)(outFolder);
        }
        (0, compression_1.compressFromFolder)(inPath, outFolder, true);
    }
    else if (stat.isFile) {
        (0, compression_1.compress)(inPath, outPath ? outPath : inPath);
    }
}
else {
    (0, console_1.trace)(locale_1.locale['wrongInputFile'], { textColor: console_1.colors.red });
}
