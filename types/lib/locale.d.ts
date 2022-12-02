declare class Locale {
    initialize(): void;
    format(localeString: string, localeStrings?: string[]): string;
    load(language: string): void;
    change(): string;
}
export declare const locale: Locale;
export {};
