/**
 * Encodes textures from given folder into a .sc file with given name.
 *
 * @param folderpath Path to folder with textures
 * @param outFilepath Out file name
 * @param output Enables output to console
 */
export declare function textureEncode(folderpath: string, outFilepath: string, output?: boolean): void;
/**
 * Encodes all folders in specified folder to _tex.sc files.
 *
 * @param inFolderpath Path to folder that contains folders with textures
 * @param outFolderpat Output folder
 * @param output Enables output to console
 */
export declare function textureEncodeFromFolder(inFolderpath: string, outFolderpath: string, output?: boolean): void;
