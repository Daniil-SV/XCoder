import { COMPRESSION } from 'supercell-swf';
declare class Config {
    package: any;
    version: any;
    defaultCompression: COMPRESSION;
    language: string;
    lastCheckedVersion: string;
    warningShown: boolean;
    warningEnabled: boolean;
    configPath: string;
    MAJOR: any;
    MINOR: any;
    PATCH: any;
    initialize(forceInit?: boolean): void;
    selectLanguage(): void;
    selectCompression(): void;
    makeDirs(force?: boolean): void;
    dump(): void;
}
export declare const config: Config;
export {};
