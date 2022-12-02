#!/usr/bin/env node
import { existsSync, lstatSync, mkdirSync } from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { colors, trace } from '../lib/console';
import { decompress, decompressFromFolder } from '../lib/features/compression';
import { locale } from '../lib/locale';

const { argv } = yargs(hideBin(process.argv));

const inPath: string = argv['input'] || argv['i'];
const outPath: string = argv['output'] || argv['o'];
locale.initialize();

if (existsSync(inPath)) {
	const stat = lstatSync(inPath);

	if (stat.isDirectory()) {
		const outFolder = outPath || inPath + '_decompressed';
		if (!existsSync(outFolder)) {
			mkdirSync(outFolder);
		}
		decompressFromFolder(inPath, outFolder, true);

	} else if (stat.isFile) {
		decompress(inPath, outPath ? outPath : inPath);
	}

} else {
	trace(locale['wrongInputFile'], {textColor: colors.red});
}
