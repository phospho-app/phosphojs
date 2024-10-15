import * as crypto from "crypto";
import * as fs from "fs/promises";
import * as path from "path";

/**
 * Verify if the env variable exists in either Node or Deno.
 * @param {string} variable name
 * @returns {string | undefined}
 */
export const lookupEnvVariable = (variable: string): string | undefined => {
  if (typeof process !== "undefined" && process.env?.[variable]) {
    return process.env[variable];
  }

  // @ts-ignore
  if (typeof Deno !== "undefined" && Deno.env?.get(variable)) {
    // @ts-ignore
    return Deno.env.get(variable);
  }

  return undefined;
};

export const debounce = (func: Function, timeout = 500) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

/**
 * Asynchronously hash all code in a directory or list of directories, ignoring files starting with '.' and 'node_modules'.
 * @param {string | string[]} directory - The directory or list of directories to hash
 * @param {number} length - The length of the hash to return
 * @returns {Promise<string>} A promise that resolves to the hexadecimal hash of the code
 */
export const hashCode = async (
  directory: string | string[],
  length: number = 10
): Promise<string> => {
  if (Array.isArray(directory)) {
    directory.sort(); // To make sure users get the same hash regardless of the order of directories
    const hashes = await Promise.all(
      directory.map((dir) => getDirectoryHash(dir))
    );
    const contentHash = crypto.createHash("sha256");
    for (const hash of hashes) {
      contentHash.update(hash);
    }
    const result = contentHash.digest("hex");
    return result.slice(0, length);
  } else if (typeof directory === "string") {
    const result = await getDirectoryHash(directory);
    return result.slice(0, length);
  } else {
    throw new Error("Invalid input type");
  }
};

/**
 * Asynchronously hash all code in a directory, ignoring files starting with '.' and 'node_modules'.
 * @param {string} dir - The directory to hash
 * @returns {Promise<string>} A promise that resolves to the hexadecimal hash of the code
 */
const getDirectoryHash = async (dir: string): Promise<string> => {
  const files = await getAllFiles(dir);
  const sortedFiles = files.sort(); // To make sure users get the same hash regardless of the order of files

  const fileHashes = await Promise.all(
    sortedFiles.map(async (file) => {
      const content = await fs.readFile(file, "utf8");
      const fileHash = crypto.createHash("sha256");
      fileHash.update(file); // Include filename in hash
      fileHash.update(content);
      return fileHash.digest("hex");
    })
  );

  const contentHash = crypto.createHash("sha256");
  for (const hash of fileHashes) {
    contentHash.update(hash);
  }

  return contentHash.digest("hex");
};

/**
 * Recursively get all files in a directory, ignoring files starting with '.' and 'node_modules'.
 * @param {string} dir - The directory to search
 * @returns {Promise<string[]>} A promise that resolves to an array of file paths
 */
const getAllFiles = async (dir: string): Promise<string[]> => {
  let results: string[] = [];
  const list = await fs.readdir(dir);

  await Promise.all(
    list.map(async (file) => {
      const fullPath = path.resolve(dir, file);
      const stat = await fs.stat(fullPath);

      // Ignore files/directories starting with '.' and 'node_modules'
      if (file.startsWith(".") || file === "node_modules") {
        return;
      }

      if (stat.isDirectory()) {
        const subDirFiles = await getAllFiles(fullPath);
        results = results.concat(subDirFiles);
      } else {
        results.push(fullPath);
      }
    })
  );

  return results;
};
