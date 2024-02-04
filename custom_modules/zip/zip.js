import fs from 'fs';
import fsPromises from 'fs/promises';
import os from 'os';
import path from 'path';
import zlib from 'zlib';
import { pipeline } from 'stream';
import { getPathToFile } from '../basic-fs/basic-fx.js';

async function compress(thisObj, currentDir, args) {
  if (args.length !== 2
    || args[0].trim() === ""
    || args[1].trim() === "") {
    throw new Error("Wrong number of arguments");
  }

  try {
    const sourcePath = await getPathToFile(currentDir, args[0]);

    let destinationPath =  await getPathToFile(currentDir, args[1]);
    if (!destinationPath.endsWith('.br')) {
      try {
        const destinationPathStat = await fsPromises.stat(destinationPath);
        if (destinationPathStat.isDirectory()) {
          const fileBaseName = path.parse(sourcePath).base + '.br';
          destinationPath = path.join(
            destinationPath,
            fileBaseName
          );
        } else if (destinationPathStat.isFile()) {
          destinationPath = destinationPath + '.br';
        }
      } catch {
        destinationPath = destinationPath + '.br';
      }
    }

    const input = await fs.createReadStream(sourcePath);
    const brotliZip = zlib.createBrotliCompress();
    const output = await fs.createWriteStream(destinationPath);
    pipeline(
        input,
        brotliZip,
        output,
        (err) => {
          if (err) {
            thisObj.push('Operation failed');
            fsPromises.rm(destinationPath);
          } 
          thisObj.push(os.EOL + os.EOL);
          thisObj.push(`You are currently in ${currentDir}`);
          thisObj.push(os.EOL);
        }
    );
  } catch {
    console.error('Operation failed');
    thisObj.push(os.EOL + os.EOL);
    thisObj.push(`You are currently in ${currentDir}`);
    thisObj.push(os.EOL);
  }
}

async function decompress(thisObj, currentDir, args) {
  if (args.length !== 2
    || args[0].trim() === ""
    || args[1].trim() === "") {
    throw new Error("Wrong number of arguments");
  }

  try {
    const sourcePath = await getPathToFile(currentDir, args[0]);

    let destinationPath =  await getPathToFile(currentDir, args[1]);
    if (destinationPath.endsWith('.br')) {
      destinationPath = destinationPath.slice(0, -3);
    } else {
      try {
        const destinationPathStat = await fsPromises.stat(destinationPath);
        if (destinationPathStat.isDirectory()) {
          const fileBaseName = path.parse(sourcePath).base.slice(0, -3);
          destinationPath = path.join(
            destinationPath,
            fileBaseName
          );
        } else if (destinationPathStat.isFile()) {
          destinationPath = destinationPath;
        }
      } catch {
        destinationPath = destinationPath;
      }
    }

    if (await fsPromises.access(sourcePath)) {
      throw new Error('Invalid source path');
    }

    const input = fs.createReadStream(sourcePath);
    const brotliZip = zlib.createBrotliDecompress();
    const output = fs.createWriteStream(destinationPath);
    pipeline(
        input,
        brotliZip,
        output,
        (err) => {
            if (err) {
              thisObj.push('Operation failed');
              fsPromises.rm(destinationPath);
            } 
            thisObj.push(os.EOL + os.EOL);
            thisObj.push(`You are currently in ${currentDir}`);
            thisObj.push(os.EOL);
        }
    );
  } catch {
    console.error('Operation failed');
    thisObj.push(os.EOL + os.EOL);
    thisObj.push(`You are currently in ${currentDir}`);
    thisObj.push(os.EOL);
  }
}

export { compress, decompress };