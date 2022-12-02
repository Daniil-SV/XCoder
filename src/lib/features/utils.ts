import { SupercellSWF, Texture, STATES, CHANNEL_FORMATS } from 'supercell-swf';
import { trace, colors } from '../console';
import { locale } from '../locale';
import * as path from 'path';
import * as PNG from 'fast-png';
import { Image } from 'image-js';
import * as fs from 'fs';

export function createSWF(output: boolean = true): SupercellSWF {
	const swf = new SupercellSWF();
	swf.progress = output ? function (state, property) {
		switch (state) {
			case STATES.resources_load:
				// process.stdout.write(`Resources loading: ${property}% \r`);
				break;
			case STATES.resources_save:
				// process.stdout.write(`Resources writing: ${property}% \r`);
				break;
			case STATES.texture_save:
			case STATES.texture_load:
				trace(locale['aboutTexture'], {
					textColor: colors.green, isProgress: true, localeStrings: [
						property[0],
						property[1],
						swf.textures[property[1]].pixelFormat,
						swf.textures[property[1]].width,
						swf.textures[property[1]].height]
				});
				break;
			case STATES.loading:
				trace(locale['fileLoading'], { localeStrings: [path.parse(property).base] });
				break;
			case STATES.loadingFinish:
				trace(locale['fileLoaded'], { localeStrings: [path.parse(property).base] });
				break;
			case STATES.saving:
				trace(locale['fileSaving'], { localeStrings: [path.parse(property).base] });
				break;
			case STATES.savingFinish:
				trace(locale['fileSaved'], { localeStrings: [path.parse(property).base] });
				break;
			default:
				break;
		}
	} : function (state, property) { };
	return swf;
}

export function createTexture(filepath: string): Texture {
	const texture = new Texture();
	const image = PNG.decode(fs.readFileSync(filepath));
	switch (image.channels) {
		case 1:
			texture.pixelFormat = CHANNEL_FORMATS['GREY'][0];
			break;
		case 2:
			texture.pixelFormat = CHANNEL_FORMATS['GREYA'][0];
			break;
		case 3:
			texture.pixelFormat = CHANNEL_FORMATS['RGB'][0];
			break;
		case 4:
			texture.pixelFormat = CHANNEL_FORMATS['RGBA'][0];
			break;
	}

	texture.image = new Image(image.width, image.height, image.data, {
		components: image.channels % 2 === 0 ? image.channels - 1 : image.channels,
		alpha: image.channels % 2 === 0 ? 1 : 0,
		bitDepth: image.depth,
	});

	return texture;
}
