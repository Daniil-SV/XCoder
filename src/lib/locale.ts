import * as fs from 'fs';
import * as path from 'path';
import { selectFromArray } from './console';
const input = require('prompt-sync')({ sigint: true });

class Locale {
	xcoderHeader: string;
	choice: string;
	done: string;
	toContinue: string;

	scLabel: string;
	scToTexture: string;
	scToTexture_description: string;
	textureToSc: string;
	textureToSc_description: string;

	otherFeaturesLable: string;
	changeLanguage: string;
	clearDirs: string;
	exit: string;
	changeLanguage_description: string;
	clearDirs_description: string;

	fileLoading: string;
	fileSaving: string;

	aboutTexture: string;
	illegalSize: string;
	resize_qu: string;

	imageSaving: string;

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
