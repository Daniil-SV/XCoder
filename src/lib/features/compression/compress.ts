import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import path = require('path');
import { ScBuffer } from 'supercell-swf';
import { config } from '../../config';
import { trace } from '../../console';
import { locale } from '../../locale';

/**
 * Compresses file and saves it to specified path.
 *
 * @param filepath Path to decompressed file
 * @param outpath Path to compressed file
 */
export function compress(filepath: string, outpath: string) {
	if (existsSync(filepath)) {
		const buffer = readFileSync(filepath);
		writeFileSync(outpath, ScBuffer.fromBuffer(buffer).toCompressed(config.defaultCompression, outpath.endsWith('.sc')));
	}
}

/**
 * Compresses all files in specified folder to another specified folder.
 *
 * @param folderpath Path to folder with decompressed files
 * @param outFolderpath Path to folder with compressed files
 * @param consoleOutput Enables output to console
 */
export function compressFromFolder(folderpath: string, outFolderpath: string, consoleOutput = true): void {
	const dir = readdirSync(folderpath);

	for (const file of dir) {
		trace(locale['fileSaving'], { localeStrings: [path.parse(file).base] });
		compress(path.resolve(folderpath, file), path.resolve(outFolderpath, file));
		trace(locale['fileSaved'], { localeStrings: [path.parse(file).base] });
	}
}
