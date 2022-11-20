const input = require('prompt-sync')({ sigint: true });
import { colors, bgColors, trace, clearConsole } from './console';
import { exit, makeDirs, selectLanguage } from './features/other';
import { locale } from './locale';
import { config } from './config';
import { textureEncode, texturesDecode } from './features/textures';
import { TEXTURE_IN, TEXTURE_IN_SC, TEXTURE_OUT, TEXTURE_OUT_SC } from './constants';


export function wrapText(text: string, maxlength: number) {
	const result = [''];
	if (maxlength >= text.length) {
		return text;
	} else {
		let totalStrCount = Math.floor(text.length / maxlength);
		if (text.length % maxlength !== 0) {
			totalStrCount++;
		}

		for (let i = 0; i < totalStrCount; i++) {
			if (i === totalStrCount - 1) {
				result.push(text);
			} else {
				const strPiece = text.substring(0, maxlength - 1);
				result.push(strPiece);
				result.push('<br>');
				text = text.substring(maxlength - 1, text.length);
			}
		}
	}
	return result.join('');
}

class Item {
	name = 'Item name';
	description = 'Description';
	handler: Function;
	arguments: object = {};

	constructor(options: Partial<Item>) {
		Object.assign(this, options);
	}

	run(): void {
		this.handler(this.arguments || arguments);
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
		const scCategory = new Category(locale.scLabel);
		this.categories.push(scCategory);

		scCategory.items.push(new Item({
			name: locale.scToTexture,
			description: locale.scToTexture_description,
			handler: texturesDecode,
			arguments: { inPath: TEXTURE_IN_SC, outPath: TEXTURE_OUT, output: true }
		}));

		scCategory.items.push(new Item({
			name: locale.textureToSc,
			description: locale.textureToSc_description,
			handler: textureEncode,
			arguments: { inPath: TEXTURE_IN, outPath: TEXTURE_OUT_SC, output: true }
		}));

		const otherCategory = new Category(locale.otherFeaturesLable);
		this.categories.push(otherCategory);

		otherCategory.items.push(new Item({
			name: locale.clearDirs,
			description: locale.clearDirs_description,
			handler: makeDirs
		}));

		otherCategory.items.push(new Item({
			name: locale.changeLanguage,
			description: locale.format(locale.changeLanguage_description, [config.language]),
			handler: selectLanguage
		}));

		otherCategory.items.push(new Item({
			name: locale.exit,
			description: '',
			handler: exit
		}));
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

	choice(): Item {
		console.clear();

		const width = process.stdout.columns;
		trace(locale.xcoderHeader, {
			center: true, textColor: colors.green, bgColor: bgColors.black,
			localeStrings: [require('./../package.json').version]
		});
		trace('github.com/scwmake/XCoder', { center: true });

		this.printDividerLine(width);

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

		const choice = parseInt(input(locale.choice), 10);

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
