import wrapText = require('wrap-text');
import { locale } from './locale';
const input = require('prompt-sync')({ sigint: true });

export enum colors {
	reset = '\x1b[0m',
	bright = '\x1b[1m',
	dim = '\x1b[2m',
	underscore = '\x1b[4m',
	blink = '\x1b[5m',
	reverse = '\x1b[7m',
	hidden = '\x1b[8m',

	black = '\x1b[30m',
	red = '\x1b[31m',
	green = '\x1b[32m',
	yellow = '\x1b[33m',
	blue = '\x1b[34m',
	magenta = '\x1b[35m',
	cyan = '\x1b[36m',
	white = '\x1b[37m',
	crimson = '\x1b[38m' // Scarlet
}

export enum bgColors {
	black = '\x1b[40m',
	red = '\x1b[41m',
	green = '\x1b[42m',
	yellow = '\x1b[43m',
	blue = '\x1b[44m',
	magenta = '\x1b[45m',
	cyan = '\x1b[46m',
	white = '\x1b[47m',
	crimson = '\x1b[48m'
}

interface PrintOptions {
	center: boolean;
	textColor: colors;
	bgColor: bgColors;
	isProgress: boolean;
	isError: boolean;
	localeStrings: string[];
}

export function trace(text: string,
	options?: Partial<PrintOptions>
) {
	if (!text) {
		return text;
	}
	options = Object.assign({
		center: false,
		textColor: colors.white,
		bgColor: bgColors.black,
		isProgress: false,
		localeStrings: []
	}, options ? options : {});

	if (options.localeStrings) {
		text = locale.format(text, options.localeStrings);
	}

	const lines = text.split('\n');

	for (let lineIndex = 0; lines.length > lineIndex; lineIndex++) {
		process.stdout.clearLine(0);
		process.stdout.cursorTo(0);

		const line = lines[lineIndex];

		if (options.isProgress) {
			process.stdout.write(options.center ? ' '.repeat((process.stdout.columns / 2) - (line.length / 2)) : ''
				+ options.textColor + line + colors.reset + '\r');
		} else {
			if (options.center) {
				process.stdout.write(' '.repeat((process.stdout.columns / 2) - (line.length / 2)));
			}
			console.log(options.textColor + options.bgColor + line + colors.reset);
		}

		if (options.isError) {
			throw new Error(line);
		}

	}
}

export function selectFromArray(namesList: string[], descriptionList: string[] = []) {
	for (let nameIndex = 0; namesList.length > nameIndex; nameIndex++) {
		const name = namesList[nameIndex];
		const description = descriptionList[nameIndex];

		let text = ` ${nameIndex + 1}. ${name}`;

		if (description) {
			text += ' '.repeat(Math.floor(process.stdout.columns / 4) - text.length) + ': ' + description;
		}

		console.log(wrapText(text, process.stdout.columns));
	}

	const choice = parseInt(input('>>> '), 10);
	if (choice && choice - 1 <= namesList.length) {
		return choice - 1;
	} else {
		return selectFromArray(namesList, descriptionList);
	}

}

export function question(message: string, ) {
	let answer: string;
	while (!'ny'.includes(answer)) {
		answer = input(`[????] ${message} [Y/n] `).toLowerCase();
	}

	return 'ny'.indexOf(answer) ? true : false;
}

export function clearConsole(): void {
	process.stdout.write('\u001b[3J\u001b[2J\u001b[1J');
	console.clear();
}

