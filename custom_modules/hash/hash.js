import fs from 'fs';
import os from 'os';
import { createHash } from 'crypto';
import { getPathToFile } from '../basic-fs/basic-fx.js';


async function getHash(thisObj, currentDir, filePath) {
    try {
      const initialFilePath = await getPathToFile(currentDir, filePath);
      console.log(initialFilePath);
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
        console.error('Invalid input');
        thisObj.push(os.EOL + os.EOL);
        thisObj.push(`You are currently in ${currentDir}`);
        thisObj.push(os.EOL);
      })

    } catch {
      console.error('Invalid input');
    }
};

export { getHash };