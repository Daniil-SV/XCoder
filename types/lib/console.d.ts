export declare enum colors {
    reset = "\u001B[0m",
    bright = "\u001B[1m",
    dim = "\u001B[2m",
    underscore = "\u001B[4m",
    blink = "\u001B[5m",
    reverse = "\u001B[7m",
    hidden = "\u001B[8m",
    black = "\u001B[30m",
    red = "\u001B[31m",
    green = "\u001B[32m",
    yellow = "\u001B[33m",
    blue = "\u001B[34m",
    magenta = "\u001B[35m",
    cyan = "\u001B[36m",
    white = "\u001B[37m",
    crimson = "\u001B[38m"
}
export declare enum bgColors {
    black = "\u001B[40m",
    red = "\u001B[41m",
    green = "\u001B[42m",
    yellow = "\u001B[43m",
    blue = "\u001B[44m",
    magenta = "\u001B[45m",
    cyan = "\u001B[46m",
    white = "\u001B[47m",
    crimson = "\u001B[48m"
}
interface PrintOptions {
    center: boolean;
    textColor: colors;
    bgColor: bgColors;
    isProgress: boolean;
    localeStrings: string[];
}
export declare function trace(text: string, options?: Partial<PrintOptions>): string;
export declare function selectFromArray(namesList: string[], descriptionList?: string[]): any;
export declare function question(message: string): boolean;
export declare function clearConsole(): void;
export {};
