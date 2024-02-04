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
      pathToOldFile = path.resolve(os.homedir(), pathToFile.slice(2));
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

async function cp(thisObj, currentDir, args) {
  try {
    const sourcePath = await getPathToFile(currentDir, args[0]);
    const destinationPath =  await getDestinationPath(currentDir, sourcePath, args[1]);

    const input = fs.createReadStream(sourcePath);
    const output = fs.createWriteStream(destinationPath);

    input.on("data", (chunk) => {
      output.write(chunk);
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

async function mv() {
  //
}

async function rm() {
  //
}


async function getPathToFile(currentDir, filePath) {
  let absolutePathToFile = path.resolve(currentDir, filePath);
  if (filePath.startsWith('~')) {
    absolutePathToFile = path.resolve(os.homedir(), filePath.slice(2));
  } else if (path.isAbsolute(filePath)) {
    absolutePathToFile = filePath;
  }
  return absolutePathToFile;
}


async function getDestinationPath(currentDir, sourcePath, pathToFileCopy) {
  let destinationPath =  await getPathToFile(currentDir, pathToFileCopy);
  const destinationPathStat = await fsPromises.stat(destinationPath);

  if (destinationPathStat.isDirectory()) {
    destinationPath = path.join(
      destinationPath,
      path.parse(sourcePath).base
    );
  }

  return destinationPath;
}


export { cat, add, rn, cp, mv, rm };