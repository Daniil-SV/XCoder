import { readdirSync } from 'fs';
import path = require('path');
import { MovieClip, Shape } from 'supercell-swf';
import { trace } from '../../console';
import { locale } from '../../locale';
import { createSWF } from '../utils';

export function mergeSc(folderpath: string, outFilepath: string, output = true): void {
	const basename = path.parse(folderpath).name;
	const baseSWF = createSWF(output);

	let textureIndex = 0;
	let bankIndex = 0;
	let maxId = 0;

	for (const file of readdirSync(folderpath)) {
		if (!file.endsWith('_tex.sc') && file.endsWith('sc')) {
			const swf = createSWF(output).load(path.resolve(folderpath, file));
			let swfMaxId = 0;
			baseSWF.compression = swf.compression;
			baseSWF.hasExternalTexture = swf.hasExternalTexture;
			baseSWF.highresPostfix = swf.highresPostfix;
			baseSWF.lowresPostfix = swf.lowresPostfix;

			for (const texture of swf.textures) {
				baseSWF.textures.push(texture);
			}
			for (const bank of swf.banks) {
				baseSWF.banks.push(bank);
			}

			for (const idStrring of Object.keys(swf.resources)) {
				const id = parseInt(idStrring, 10);
				const resource = swf.resources[id];
				if (id > swfMaxId) {
					swfMaxId = id;
				}

				if (resource instanceof MovieClip) {
					for (const bind of resource.binds) {
						bind.id += maxId;
					}
					resource.bankIndex += bankIndex;
				} else if (resource instanceof Shape) {
					for (const bitmap of resource.bitmaps) {
						bitmap.textureIndex += textureIndex;
					}
				}

				baseSWF.resources[id + maxId] = resource;
			}

			for (const exportName of swf.exports.getExports()) {
				baseSWF.exports.addExport(swf.exports.getExportId(exportName) + maxId, exportName);
			}

			bankIndex = baseSWF.banks.length;
			textureIndex = baseSWF.textures.length;
			maxId += swfMaxId;
		}
	}

	baseSWF.save(outFilepath);
}

export function mergeScFromFolder(folderPath: string, outFolderPath: string, output = true): void {
	const dir = readdirSync(folderPath);

	for (const file of dir) {
		mergeSc(path.resolve(folderPath, file), path.resolve(outFolderPath, file + '.sc'), output);
	}
}
