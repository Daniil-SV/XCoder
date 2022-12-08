
import * as fs from 'fs';
import { COMPRESSION } from 'supercell-swf';
import { clearConsole, selectFromArray, trace } from './console';
import { DIRS } from './constants';
import { locale } from './locale';

class Config {
	package = require('./../package.json').name;
	version = require('./../package.json').version;
	defaultCompression: COMPRESSION = COMPRESSION.FAST_LZMA;
	language = 'en-EU';
	lastCheckedVersion: string = undefined;
	warningShown = true;
	warningEnabled = true;
	packerPath: string;
	animatePath: string;

	configPath = __dirname + '/config.json';

	initialize(forceInit = false) {
		if (fs.existsSync(this.configPath) && !forceInit) {
			const configFile = require(this.configPath);
			Object.assign(this, configFile);
			locale.load(this.language);
		} else {
			this.warningShown = true;
			this.warningEnabled = true;
			this.selectLanguage();
			this.selectCompression();
			if (process.platform === 'win32' || process.platform === 'darwin') {
				this.selectAnimatePath();
				this.selectPackerPath();
			}
		}

		this.makeDirs();
		this.dump();
	}

	selectLanguage(): void {
		clearConsole();
		this.language = locale.change();
		locale.initialize();
		clearConsole();
	}

	selectCompression(): void {
		const compressions = [];
		const compressionDescribes = [];
		const compressKeys = Object.keys(COMPRESSION);

		for (let compressIndex = 0; compressKeys.length / 2 > compressIndex; compressIndex++) {
			const compressionType = COMPRESSION[compressIndex];

			if (compressIndex) {
				switch (compressionType) {
					case 'LZMA':
						compressionDescribes.push(locale['lzma_describe']);
						break;
					case 'FAST_LZMA':
						compressionDescribes.push(locale['fastLzma_describe']);
						break;
					case 'LZHAM':
						compressionDescribes.push(locale['lzham_describe']);
						break;
					case 'ZSTD':
						compressionDescribes.push(locale['zstd_describe']);
						break;
					default:
						compressionDescribes.push('');
						break;
				}

				compressions.push(compressionType.replace('_', ' '));
			}
		}

		clearConsole();
		trace(locale['compression_qu']);
		this.defaultCompression = selectFromArray(compressions, compressionDescribes) + 1;
		clearConsole();
	}

	selectAnimatePath(): void {
		if (this.animatePath && fs.existsSync(this.animatePath)) {
			return;
		} else {

		}
	}

	selectPackerPath(): void {
		if (this.packerPath && fs.existsSync(this.packerPath)) {
			return;
		} else {

		}
	}

	makeDirs(force = false): void {
		for (const folder of DIRS) {
			if (fs.existsSync(folder)) {
				if (force) {
					fs.rmSync(folder, { recursive: true, force: true });
				}
			} else {
				fs.mkdirSync(folder);
			}
		}
	}

	dump(): void {
		fs.writeFileSync(this.configPath, JSON.stringify({
			language: this.language,
			defaultCompression: this.defaultCompression,
			lastCheckedVersion: this.lastCheckedVersion,
			warningShown: this.warningShown,
			warningEnabled: this.warningEnabled,
			animatePath: this.animatePath,
			packerPath: this.packerPath
		}));
	}
}

export const config = new Config();
