import { COMPRESSION } from 'supercell-swf';
declare class Config {
    package: any;
    version: any;
    defaultCompression: COMPRESSION;
    language: string;
    lastCheckedVersion: string;
    warningShown: boolean;
    warningEnabled: boolean;
    packerPath: string;
    animatePath: string;
    configPath: string;
    initialize(forceInit?: boolean): void;
    selectLanguage(): void;
    selectCompression(): void;
    selectAnimatePath(): void;
    selectPackerPath(): void;
    makeDirs(force?: boolean): void;
    dump(): void;
}
export declare const config: Config;
export {};
