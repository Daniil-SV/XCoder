#!/usr/bin/env node
/**
 * Decompresses a file and saves it to specified filepath
 *
 * @param filepath Path to compressed file
 * @param outpath Path to to decompressed file
 */
export declare function decompress(filepath: string, outpath: string): void;
/**
 * Decompresses all files in specified folder and saves to another specified folder.
 *
 * @param folderpath Folder with compressed files
 * @param outFolderpath Folder with decompressed files
 * @param output Enables output to console
 */
export declare function decompressFromFolder(folderpath: string, outFolderpath: any, output?: boolean): void;
