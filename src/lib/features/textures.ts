const prompt = require('prompt-sync')({ sigint: true });
import * as fs from 'fs';
import * as path from 'path';
import { hrtime } from 'process';
import { Texture } from 'supercell-swf';
import { trace, colors, bgColors, question } from '../console';
import { locale } from '../locale';
import { createSWF } from './utils';
import * as PNG from 'fast-png';
import { Image } from 'image-js';
import { config } from '../config';

export function texturesDecode(options = { inPath: undefined, outPath: undefined, output: true }): void {
	if (!options.inPath || !options.outPath) {
		throw new Error('Path not specified!');
	}

	const dir = fs.readdirSync(options.inPath);
	for (const file of dir) {
		if (file.endsWith('_tex.sc')) {
			const startTime = hrtime();

			const folder = `${options.outPath}/${path.parse(file).name}`;
			if (fs.existsSync(folder)) {
				fs.rmSync(folder, { recursive: true, force: true });
			}

			fs.mkdirSync(folder);

			const infoFile = [];

			const swf = createSWF(options.output).loadExternalTexture(`${options.inPath}/${file}`);
			trace(locale.imageSaving, { textColor: colors.green });
			for (let i = 0; swf.textures.length > i; i++) {
				const texture = swf.textures[i];

				fs.writeFileSync(`${folder}/${path.parse(file).name}${'_'.repeat(i)}.png`, texture.image.toBuffer());

				infoFile.push(texture.toJSON());
			}

			fs.writeFileSync(`${folder}/${path.parse(file).name}.json`, JSON.stringify(infoFile, null, 2));

			if (options.output) {
				process.stdout.clearLine(0);
				process.stdout.cursorTo(0);
				trace(locale.done, { center: false, textColor: colors.black, bgColor: bgColors.green, localeStrings: [hrtime(startTime).join(',')] });
			}
		}
	}

	if (options.output) { prompt(locale.toContinue); }
}

export function textureEncode(options = { inPath: undefined, outPath: undefined, output: true }): void {
	const dirs = fs.readdirSync(options.inPath);

	for (const folderName of dirs) {
		const startTime = hrtime();
		const swf = createSWF(options.output);
		swf.compression = config.defaultCompression;
		const folder = `${options.inPath}/${folderName}`;
		const dirContent = fs.readdirSync(folder);

		const texturesInfo = dirContent.includes(`${folderName}.json`) ? require(`${path.resolve(folder)}/${folderName}.json`) : [];

		let textureIndex = 0;
		for (const file of dirContent) {
			if (file.endsWith('.png')) {
				const texture = new Texture();
				const image = PNG.decode(fs.readFileSync(`${folder}/${file}`));
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
							if (options.output) {
								trace(locale.illegalSize, { localeStrings: [width, height, texture.width, texture.height] });
								resize = question(locale.resize_qu);
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

		swf.saveExternalTexture(`${options.outPath}/${folderName}.sc`, false);

		if (options.output) {
			process.stdout.clearLine(0);
			process.stdout.cursorTo(0);
			trace(locale.done, { center: false, textColor: colors.black, bgColor: bgColors.green, localeStrings: [hrtime(startTime).join(',')] });
		}
	}
	if (options.output) { prompt(locale.toContinue); }
}
