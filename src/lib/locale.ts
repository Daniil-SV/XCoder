import * as fs from 'fs';
import * as path from 'path';
import { config } from './config';
import { selectFromArray } from './console';

class Locale {
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
		const localeDir = path.resolve(__dirname, `../locales/`);
		const languagePath = path.resolve(localeDir, `${language}.json`);

		let languageLocale: any;
		if (fs.existsSync(languagePath)) {
			languageLocale = require(languagePath);
		} else {
			languageLocale = require(path.resolve(localeDir, `en-EU.json`));
		}

		Object.assign(this, languageLocale);
	}

	change(): string {
		const locales = fs.readdirSync(path.resolve(__dirname, `../locales/`));

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
