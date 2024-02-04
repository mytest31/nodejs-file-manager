import fs from 'fs';
import fsPromises from 'fs/promises';
import os from 'os';
import path from 'path';
import { pipeline } from 'stream';


function cat(thisObj, currentDir, pathToFile) {
  try {
    let readFilePath = pathToFile;
    if (!path.isAbsolute(pathToFile)) {
      readFilePath = path.resolve(currentDir, pathToFile);
    }
    const input = fs.createReadStream(readFilePath);
    
    input.on('data', (chunk) => {
      thisObj.push(chunk);
    })

    input.on('end', () => {
      thisObj.push(os.EOL + os.EOL);
      thisObj.push(`You are currently in ${currentDir}`);
      thisObj.push(os.EOL);
    })

    input.on('error', () => {
      console.error('Invalid input');  
      input.emit('end');
    })

  } catch {
    console.error('Invalid input');
  }
}

async function add(currentDir, fileName) {
  try {
    const filePath = path.join(currentDir, fileName);
    await fsPromises.writeFile(filePath, '');
  } catch {
    console.error('Invalid input');
  }
}

async function rn(currentDir, args) {
  try {
    const pathToFile = args[0];
    const newFileName = args[1];
    let pathToOldFile = path.resolve(currentDir, pathToFile);
    if (pathToFile.startsWith('~')) {
      pathToOldFile = path.resolve(os.homedir(), pathToFile.slice(1));
    } else if (path.isAbsolute(pathToFile)) {
      pathToOldFile = pathToFile;
    } else {
      pathToOldFile = path.resolve(currentDir, pathToFile);
    }

    let pathToNewFile = path.join(
      path.dirname(pathToOldFile), 
      path.parse(newFileName).base
    );

    await fsPromises.rename(pathToOldFile, pathToNewFile);

  } catch {
    console.error('Invalid input');
  }
}

async function cp() {
  //
}

async function mv() {
  //
}

async function rm() {
  //
}





export { cat, add, rn, cp, mv, rm };