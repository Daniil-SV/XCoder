import * as fs from 'fs';
import { COMPRESSION } from 'supercell-swf';
import { makeDirs } from './features/other';
import { locale } from './locale';

class Config {
	version = require('./../package.json').version;
	defaultCompression: COMPRESSION = COMPRESSION.FAST_LZMA;
	language = 'en-EU';

	initialize() {
		if (fs.existsSync('./config.json')) {
			const configFile = require('../config.json');
			Object.assign(this, configFile);
			locale.load(this.language);
		} else {
			this.language = locale.change();
			makeDirs();
			this.dump();
		}
	}

	selectLanguage() {
		this.language = locale.change();
		locale.load(this.language);
		this.dump();
	}

	selectCompression() {

	}

	dump() {
		fs.writeFileSync('./config.json', JSON.stringify({
			version: this.version,
			language: this.language
		}));
	}
}

export const config = new Config();
