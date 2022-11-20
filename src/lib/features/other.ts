import { clearConsole } from '../console';
import { config } from '../config';
import * as fs from 'fs';
import { DIRS } from '../constants';


export function selectLanguage() {
	clearConsole();
	config.selectLanguage();
}

export function makeDirs() {
	for (const folder of DIRS) {
		if (fs.existsSync(folder)) {
			fs.rmSync(folder, { recursive: true, force: true });
		}

		fs.mkdirSync(folder);
	}
}

export function exit() {
	clearConsole();
	process.exit();
}
