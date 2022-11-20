import { config } from './lib/config';
import { clearConsole } from './lib/console';
config.initialize();

import { menu } from './lib/menu';

while (true) {
	const item = menu.choice();

	if (item.handler) {
		item.run();
	}
	clearConsole();
}
