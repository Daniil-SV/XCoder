import * as fs from 'fs';
import * as path from 'path';
import { Texture } from 'supercell-swf';
import { trace, question } from '../../console';
import { locale } from '../../locale';
import { createSWF } from './../utils';
import * as PNG from 'fast-png';
import { Image } from 'image-js';
import { config } from '../../config';

/**
 * Encodes textures from given folder into a .sc file with given name.
 *
 * @param folderpath Path to folder with textures
 * @param outFilepath Out file name
 * @param output Enables output to console
 */
export function textureEncode(folderpath: string, outFilepath: string, output = true): void {
	const swf = createSWF(output);
	swf.compression = config.defaultCompression;
	const dirContent = fs.readdirSync(folderpath);
	const jsonPath = `${folderpath}/${path.parse(folderpath).name}.json`;

	const texturesInfo = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath).toString()) : [];

	let textureIndex = 0;
	for (const file of dirContent) {
		if (file.endsWith('.png')) {
			const texture = new Texture();
			const image = PNG.decode(fs.readFileSync(`${folderpath}/${file}`));
			texture.image = new Image(image.width, image.height, image.data, {
				components: image.channels % 2 === 0 ? image.channels - 1 : image.channels,
				alpha: image.channels % 2 === 0 ? 1 : 0,
				bitDepth: image.depth,
			});

			const textureInfo = texturesInfo[textureIndex];
			if (textureInfo !== undefined) {
				const width = textureInfo.width;
				const height = textureInfo.height;

				if (width && height) {
					if (width !== texture.width || height !== texture.height) {
						let resize = true;
						if (output) {
							trace(locale['illegalSize'], { localeStrings: [width, height, texture.width, texture.height] });
							resize = question(locale['resize_qu']);
						}

						if (!resize) {
							textureInfo.width = texture.width;
							textureInfo.height = texture.height;
						}
					}
				}
				texture.fromJSON(textureInfo);
			}
			swf.textures.push(texture);
			textureIndex++;
		}
	}

	swf.saveExternalTexture(outFilepath, false);
}

/**
 * Encodes all folders in specified folder to _tex.sc files.
 *
 * @param inFolderpath Path to folder that contains folders with textures
 * @param outFolderpat Output folder
 * @param output Enables output to console
 */
export function textureEncodeFromFolder(inFolderpath: string, outFolderpath: string, output = true): void {
	const dirs = fs.readdirSync(inFolderpath);

	for (const folderName of dirs) {
		textureEncode(path.resolve(inFolderpath, folderName), `${path.resolve(outFolderpath, folderName)}.sc`, true);
	}
}
