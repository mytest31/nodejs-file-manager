import fs from 'fs';
import os from 'os';
import path from 'path';
import { pipeline } from 'stream';


async function cat(thisObj, currentDir, pathToFile) {
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
    console.error('Invalid input 3');
  }
}

async function add() {
  //
}

async function rn() {
  //
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