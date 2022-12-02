/**
 * Compresses file and saves it to specified path.
 *
 * @param filepath Path to decompressed file
 * @param outpath Path to compressed file
 */
export declare function compress(filepath: string, outpath: string): void;
/**
 * Compresses all files in specified folder to another specified folder.
 *
 * @param folderpath Path to folder with decompressed files
 * @param outFolderpath Path to folder with compressed files
 * @param consoleOutput Enables output to console
 */
export declare function compressFromFolder(folderpath: string, outFolderpath: string, consoleOutput?: boolean): void;
