import * as fs from 'fs';
import * as path from 'path';
import { trace, colors } from '../../console';
import { locale } from '../../locale';
import { createSWF } from './../utils';

/**
 * Decodes _tex.sc texture to specified folder.
 *
 * @param filepath Path to _tex.sc file
 * @param outFolderpath Path to folder where files will be saved
 * @param output Enables output to console
 */
export function texturesDecode(filepath: string, outFolderpath: string, output = true): void {

	const infoFile = [];

	const swf = createSWF(output).loadExternalTexture(filepath);
	trace(locale['imageSaving'], { textColor: colors.green });
	for (let i = 0; swf.textures.length > i; i++) {
		const texture = swf.textures[i];

		fs.writeFileSync(`${outFolderpath}/${path.parse(filepath).name}${'_'.repeat(i)}.png`, texture.image.toBuffer());

		infoFile.push(texture.toJSON());
	}

	fs.writeFileSync(`${outFolderpath}/${path.parse(filepath).name}.json`, JSON.stringify(infoFile, null, 2));
}

/**
 * Decodes all _tex.sc files that will be found in specified folder.
 *
 * @param folderpath Path to folder with _tex.sc files
 * @param outFolderpath Path to output folder
 * @param output Enables output to console
 */
export function textureDecodeFromFolder(folderpath: string, outFolderpath: string, output: boolean = true): void {
	const dir = fs.readdirSync(folderpath);

	for (const file of dir) {
		if (file.endsWith('_tex.sc')) {
			const folder = `${outFolderpath}/${path.parse(file).name}`;
			if (fs.existsSync(folder)) {
				fs.rmSync(folder, { recursive: true, force: true });
			}
			fs.mkdirSync(folder);

			texturesDecode(path.resolve(folderpath, file), folder, output);
		}
	}
}
