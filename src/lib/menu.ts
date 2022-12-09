const input = require('prompt-sync')({ sigint: true });
import { colors, bgColors, trace, clearConsole } from './console';
import { locale } from './locale';
import { config } from './config';
import { textureDecodeFromFolder, textureEncodeFromFolder } from './features/textures';
import {
	COMPRESSION_IN, COMPRESSION_IN_FILE,
	COMPRESSION_OUT, COMPRESSION_OUT_FILE,
	MERGE_IN,
	MERGE_OUT,
	TEXTURE_IN, TEXTURE_IN_SC,
	TEXTURE_OUT, TEXTURE_OUT_SC
} from './constants';
import { compressFromFolder, decompressFromFolder } from './features/compression';
import { COMPRESSION } from 'supercell-swf';
import wrapText = require('wrap-text');
import { hrtime } from 'process';
import * as deasync from 'deasync';
import fetch from 'node-fetch';
import { mergeScFromFolder } from './features/merge';

function getNpmVersion(name: string): string {
	let version = '0.0.0';

	(async () => {
		try {
			const url = `https://registry.npmjs.org/${name}/`;
			const res = await fetch(url);
			const data = await res.json();
			const versions = Object.keys(data.versions);
			version = versions[versions.length - 1];
		} catch (e) {
			version = undefined;
		}
	})();

	deasync.loopWhile(function () { return version === '0.0.0'; });
	return version;
}


class Item {
	name = 'Item name';
	description = 'Description';
	showTime = true;
	handler: Function;
	arguments: object = {};

	constructor(options: Partial<Item>) {
		Object.assign(this, options);
	}

	run(...args: any): void {
		const startTime = hrtime();

		this.handler.apply(this, this.arguments || args);
		if (this.showTime) {
			process.stdout.clearLine(0);
			process.stdout.cursorTo(0);
			trace(locale['done'], { textColor: colors.black, bgColor: bgColors.green, localeStrings: [hrtime(startTime).join(',')] });
			input(locale['toContinue']);
		}
	}
}


class Category {
	name: string;
	items: Item[] = [];

	constructor(name: string) {
		this.name = name;
	}
}


class Menu {
	categories: Category[] = [];

	constructor() {
		this.initialize();
	}

	printCategory(text: string) {
		trace(text, { textColor: colors.black, bgColor: bgColors.green });
	}

	printFeature(id: number, name: string, description: string = undefined, width = -1) {
		let text = ` ${id} ${name}`;

		if (description) {
			text += ' '.repeat(Math.floor(width / 2) - text.length) + ': ' + description;
		}

		console.log(wrapText(text, width));
	}

	printDividerLine(width: number) {
		console.log('-'.repeat(width));
	}

	initialize() {
		this.categories = [];

		const scCategory = new Category(locale['scCategory']);
		this.categories.push(scCategory);

		scCategory.items.push(new Item({
			name: locale['scMerge'],
			description: locale['scMerge_description'],
			handler: mergeScFromFolder,
			arguments: [MERGE_IN, MERGE_OUT, true]
		}));

		const scTexturesCategory = new Category(locale['scTexturesLabel']);
		this.categories.push(scTexturesCategory);

		scTexturesCategory.items.push(new Item({
			name: locale['scToTexture'],
			description: locale['scToTexture_description'],
			handler: textureDecodeFromFolder,
			arguments: [TEXTURE_IN_SC, TEXTURE_OUT, true]
		}));

		scTexturesCategory.items.push(new Item({
			name: locale['textureToSc'],
			description: locale['textureToSc_description'],
			handler: textureEncodeFromFolder,
			arguments: [TEXTURE_IN, TEXTURE_OUT_SC, true]
		}));

		const compressingCategory = new Category(locale['compressionLabel']);
		this.categories.push(compressingCategory);

		compressingCategory.items.push(new Item({
			name: locale['fileCompress'],
			description: locale['fileCompress_description'],
			handler: compressFromFolder,
			arguments: [COMPRESSION_IN, COMPRESSION_OUT_FILE, true]
		}));

		compressingCategory.items.push(new Item({
			name: locale['fileDecompress'],
			description: locale['fileDecompress_description'],
			handler: decompressFromFolder,
			arguments: [COMPRESSION_IN_FILE, COMPRESSION_OUT, true]
		}));

		const otherCategory = new Category(locale['otherFeaturesLabel']);
		this.categories.push(otherCategory);

		otherCategory.items.push(new Item({
			name: locale['clearDirs'],
			description: locale['clearDirs_description'],
			showTime: false,
			handler: function () {
				config.makeDirs(true);
			}
		}));

		otherCategory.items.push(new Item({
			name: locale['changeLanguage'],
			description: locale.format(locale['changeLanguage_description'], [config.language]),
			showTime: false,
			handler: function () {
				config.selectLanguage();
				menu.initialize();
			}
		}));

		otherCategory.items.push(new Item({
			name: locale['changeCompression'],
			description: locale.format(locale['changeCompression_description'], [COMPRESSION[config.defaultCompression]]),
			showTime: false,
			handler: function () {
				config.selectCompression();
				menu.initialize();
			}
		}));

		otherCategory.items.push(new Item({
			name: locale['reInit'],
			description: locale['reInit_description'],
			showTime: false,
			handler: function () {
				config.initialize(true);
			}
		}));

		if (config.warningEnabled && config.version !== config.lastCheckedVersion) {
			otherCategory.items.push(new Item({
				name: locale['disableWarnings'],
				description: '',
				showTime: false,
				handler: function () {
					config.warningEnabled = false;
					menu.initialize();
				}
			}));
		}

		otherCategory.items.push(new Item({
			name: locale['exit'],
			description: '',
			showTime: false,
			handler: function () {
				clearConsole();
				process.exit();
			}
		}));
	}

	choice(): Item {
		console.clear();
		const npmVersion = getNpmVersion(config.package);
		const width = process.stdout.columns;

		let versionType = 'Unknown';
		if (npmVersion !== config.version) {
			versionType = 'Outdated';
		} else {
			versionType = 'Latest';
		}

		trace(locale['xcoderHeader'], {
			center: true, textColor: colors.green, bgColor: bgColors.black,
			localeStrings: [config.version, versionType]
		});
		trace('github.com/scwmake/XCoder', { center: true });

		if (npmVersion !== undefined) {
			config.lastCheckedVersion = npmVersion;
			const [SERVER_MAJOR, SERVER_MINOR, SERVER_PATCH] = npmVersion.split('.');
			const [CLIENT_MAJOR, CLIENT_MINOR, CLIENT_PATCH] = config.version.split('.');
			const [MAJOR, MINOR, PATCH] = config.lastCheckedVersion.split('.');

			if (SERVER_MAJOR > CLIENT_MAJOR) {
				trace(locale['outdatedPackage'], { textColor: colors.red, center: true, localeStrings: [config.version] });
				trace(locale['updateCommand'], { textColor: colors.yellow, center: true, isError: true, localeStrings: [config.package] });
			} else if (SERVER_MINOR > CLIENT_MINOR) {
				if (config.warningEnabled) {
					trace(locale['oldVersion'], { textColor: colors.green, localeStrings: [npmVersion], center: true });
					trace(locale['updateCommand'], { textColor: colors.yellow, center: true, localeStrings: [config.package] });
				}
			} else if (SERVER_PATCH > PATCH) {
				if (npmVersion !== config.lastCheckedVersion) {
					config.warningShown = false;
					if (config.warningEnabled && !config.warningShown) {
						trace(locale['oldVersion'], { textColor: colors.green, center: true, localeStrings: [npmVersion] });
						trace(locale['updateCommand'], { textColor: colors.yellow, center: true, localeStrings: [config.package] });
						config.warningShown = true;
					}
				}
			}
			config.dump();
		}

		this.printDividerLine(width);
		this.initialize();

		let itemsCounter = 1;
		const items = {};

		for (let categoryIndex = 0; this.categories.length > categoryIndex; categoryIndex++) {
			const category = this.categories[categoryIndex];
			this.printCategory(category.name);

			for (let itemIndex = 0; category.items.length > itemIndex; itemIndex++) {
				const item = category.items[itemIndex];
				items[itemsCounter] = item;
				this.printFeature(itemsCounter, item.name, item.description, width);
				itemsCounter++;
			}
			this.printDividerLine(width);
		}

		const choice = parseInt(input(locale['choice']), 10);

		this.printDividerLine(width);
		if (!choice) {
			return undefined;
		}

		if (items[choice]) {
			return items[choice];
		}

		return undefined;
	}
}

export const menu = new Menu();
