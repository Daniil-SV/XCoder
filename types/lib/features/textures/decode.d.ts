/**
 * Decodes _tex.sc texture to specified folder.
 *
 * @param filepath Path to _tex.sc file
 * @param outFolderpath Path to folder where files will be saved
 * @param output Enables output to console
 */
export declare function texturesDecode(filepath: string, outFolderpath: string, output?: boolean): void;
/**
 * Decodes all _tex.sc files that will be found in specified folder.
 *
 * @param folderpath Path to folder with _tex.sc files
 * @param outFolderpath Path to output folder
 * @param output Enables output to console
 */
export declare function textureDecodeFromFolder(folderpath: string, outFolderpath: string, output?: boolean): void;
