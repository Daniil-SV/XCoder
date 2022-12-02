import * as fs from 'fs';
import * as path from 'path';
import { config } from './config';
import { selectFromArray } from './console';
import { menu } from './menu';
const input = require('prompt-sync')({ sigint: true });

class Locale {
/* 	xcoderHeader: string;
	choice: string;
	done: string;
	toContinue: string;

	scTexturesLabel: string;
	scToTexture: string;
	scToTexture_description: string;
	textureToSc: string;
	textureToSc_description: string;

	compressionLabel: string;
	fileCompress: string;
	fileCompress_description: string;
	fileDecompress: string;
	fileDecompress_description: string;

	otherFeaturesLable: string;
	changeLanguage: string;
	changeLanguage_description: string;
	changeCompression: string;
	changeCompression_description: string;
	reInit: string;
	reInit_description: string;
	clearDirs: string;
	clearDirs_description: string;
	exit: string;

	fileLoading: string;
	fileLoaded: string;
	fileSaving: string;
	fileSaved: string;

	aboutTexture: string;
	illegalSize: string;
	resize_qu: string;
	compression_qu: string;

	lzma_describe: string;
	fastLzma_describe: string;
	lzham_describe: string;
	zstd_describe: string;

	wrongInputFile: string;

	imageSaving: string; */

	initialize() {
		this.load(config.language);
	}

	format(localeString: string, localeStrings: string[] = []): string {
		let i = 0;
		if (localeString) {
			return localeString.replace(/%s/g, () => localeStrings[i++]);
		} else {
			return localeString;
		}

	}

	load(language: string): void {
		const languagePath = `${__dirname}/locales/${language}.json`;
		const defaultLanguagePath = `${__dirname}/locales/en-EU.json`;

		let languageLocale: any;
		if (fs.existsSync(languagePath)) {
			languageLocale = require(languagePath);
		} else {
			languageLocale = require(defaultLanguagePath);
		}

		Object.assign(this, languageLocale);
	}

	change(): string {
		const locales = fs.readdirSync(`${__dirname}/locales/`);

		console.log('Select language:\n');

		const languageSelected = selectFromArray(locales.map(localeFile => { return path.parse(localeFile).name; }));
		if (locales[languageSelected]) {
			this.load(path.parse(locales[languageSelected]).name);
		} else {
			return this.change();
		}

		return path.parse(locales[languageSelected]).name;
	}
}

export const locale = new Locale();
