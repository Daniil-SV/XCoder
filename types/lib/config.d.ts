import { COMPRESSION } from 'supercell-swf';
declare class Config {
    version: any;
    defaultCompression: COMPRESSION;
    language: string;
    configPath: string;
    initialize(forceInit?: boolean): void;
    selectLanguage(): void;
    selectCompression(): void;
    makeDirs(force?: boolean): void;
    dump(): void;
}
export declare const config: Config;
export {};
