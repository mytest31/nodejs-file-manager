import fs from 'fs';
import fsPromises from 'fs/promises';
import os from 'os';
import path from 'path';


function cat(thisObj, currentDir, args) {
  if (args.length !== 1 || args[0].trim() === "") {
    throw new Error("Wrong number of arguments");
  }

  try {
    let readFilePath = args[0];

    if (!path.isAbsolute(readFilePath)) {
      readFilePath = path.resolve(currentDir, args[0]);
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
      console.error('Operation failed');  
      input.emit('end');
    })

  } catch {
    console.error('Operation failed');
  }
}

async function add(currentDir, args) {
  if (args.length !== 1 || args[0].trim() === "") {
    throw new Error("Wrong number of arguments");
  }

  try {
    const fileName = args[0];
    const filePath = path.join(currentDir, fileName);
    await fsPromises.writeFile(filePath, '');
  } catch {
    console.error('Operation failed');
  }
}

async function rn(currentDir, args) {
  if (args.length !== 2
    || args[0].trim() === ""
    || args[1].trim() === "") {
    throw new Error("Wrong number of arguments");
  }

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
    console.error('Operation failed');
  }
}

async function cp(thisObj, currentDir, args) {
  if (args.length !== 2
    || args[0].trim() === ""
    || args[1].trim() === "") {
    throw new Error("Wrong number of arguments");
  }

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
      console.error('Operation failed');  
      input.emit('end');
    })
  
  } catch {
    console.error('Operation failed');
    thisObj.push(os.EOL + os.EOL);
    thisObj.push(`You are currently in ${currentDir}`);
    thisObj.push(os.EOL);
  }
}

async function mv(thisObj, currentDir, args) {
  if (args.length !== 2
    || args[0].trim() === ""
    || args[1].trim() === "") {
    throw new Error("Wrong number of arguments");
  }

  try {
    const sourcePath = await getPathToFile(currentDir, args[0]);
    const destinationPath =  await getDestinationPath(currentDir, sourcePath, args[1]);

    const input = fs.createReadStream(sourcePath);
    const output = fs.createWriteStream(destinationPath);

    input.on("data", (chunk) => {
      output.write(chunk);
    })

    input.on('end', () => {
      rm(currentDir, [args[0]]);
      thisObj.push(os.EOL + os.EOL);
      thisObj.push(`You are currently in ${currentDir}`);
      thisObj.push(os.EOL);
    })

    input.on('error', () => {
      console.error('Operation failed');
      thisObj.push(os.EOL + os.EOL);
      thisObj.push(`You are currently in ${currentDir}`);
      thisObj.push(os.EOL);
    })
  
  } catch {
    console.error('Operation failed');
    thisObj.push(os.EOL + os.EOL);
    thisObj.push(`You are currently in ${currentDir}`);
    thisObj.push(os.EOL);
  }
}


async function rm(currentDir, args) {

  if (args.length !== 1 || args[0].trim() === "") {
    throw new Error("Wrong number of arguments");
  }

  try {
    const filePath = args[0];
    const absoluteFilePath = await getPathToFile(currentDir, filePath);
    await fsPromises.rm(absoluteFilePath);
  } catch {
    console.error('Operation failed');
  }
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


export { cat, add, rn, cp, mv, rm, getPathToFile, getDestinationPath};