#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../lib/config");
const console_1 = require("../lib/console");
config_1.config.initialize();
const menu_1 = require("../lib/menu");
while (true) {
    const item = menu_1.menu.choice();
    if (item) {
        item.run();
    }
    (0, console_1.clearConsole)();
}
