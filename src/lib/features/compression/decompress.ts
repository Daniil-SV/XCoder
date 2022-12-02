#!/usr/bin/env node
import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import path = require('path');
import { ScBuffer } from 'supercell-swf';
import { colors, trace } from '../../console';
import { locale } from '../../locale';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const { argv } = yargs(hideBin(process.argv));

/**
 * Decompresses a file and saves it to specified filepath
 *
 * @param filepath Path to compressed file
 * @param outpath Path to to decompressed file
 */
export function decompress(filepath: string, outpath: string) {
	if (existsSync(filepath)) {
		const buffer = readFileSync(filepath);
		writeFileSync(outpath, ScBuffer.fromCompressed(buffer, filepath.endsWith('.sc')).buffer.toBuffer());
	}
}

/**
 * Decompresses all files in specified folder and saves to another specified folder.
 *
 * @param folderpath Folder with compressed files
 * @param outFolderpath Folder with decompressed files
 * @param output Enables output to console
 */
export function decompressFromFolder(folderpath: string, outFolderpath, output = true): void {
	const dir = readdirSync(folderpath);

	for (const file of dir) {
		trace(locale['fileSaving'], { localeStrings: [path.parse(file).base] });
		decompress(path.resolve(folderpath, file), path.resolve(outFolderpath, file));
		trace(locale['fileSaved'], { localeStrings: [path.parse(file).base] });
	}
}
