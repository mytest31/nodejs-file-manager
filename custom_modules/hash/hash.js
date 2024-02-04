import fs from 'fs';
import os from 'os';
import { createHash } from 'crypto';
import { getPathToFile } from '../basic-fs/basic-fx.js';


async function getHash(thisObj, currentDir, args) {
  if (args.length !== 1 || args[0].trim() === "") {
    throw new Error("Wrong number of arguments");
  }
  
  try {
    const filePath = args[0];
    const initialFilePath = await getPathToFile(currentDir, filePath);
    const hash = createHash('sha256');
    const input = fs.createReadStream(initialFilePath);
    
    input.on('data', (chunk) => {
      hash.update(chunk);
    });

    input.on('end', () => {
      thisObj.push('File hash: ' + hash.digest('hex'));
      thisObj.push(os.EOL + os.EOL);
      thisObj.push(`You are currently in ${currentDir}`);
      thisObj.push(os.EOL);
    });

    input.on('error', () => {
      console.error('Operation failed');
      thisObj.push(os.EOL + os.EOL);
      thisObj.push(`You are currently in ${currentDir}`);
      thisObj.push(os.EOL);
    })

  } catch {
    console.error('Operation failed');
  }
};

export { getHash };