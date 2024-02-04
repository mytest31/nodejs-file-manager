import fsPromises from 'fs/promises';
import path from 'path';
import os from 'os';

function up(currentPath) {
  return path.dirname(currentPath);
}

async function cd(currentPath, args) {
  if (args.length !== 1 || args[0].trim() === "") {
    throw new Error("Wrong number of arguments");
  }

  try {  
    const pathToDirectory = args[0];

    let resultPath = '';
    if (pathToDirectory.startsWith('~')) {
      resultPath = path.resolve(os.homedir(), pathToDirectory.slice(2));
    } else if (path.isAbsolute(pathToDirectory)) {
      resultPath = path.format(path.parse(pathToDirectory));
    } else {
      resultPath = path.resolve(currentPath, pathToDirectory);
    }

    const fileStats = await fsPromises.stat(resultPath);
    await fsPromises.access(resultPath);
    if (fileStats.isDirectory()) {
      return await fsPromises.realpath(resultPath);
    }
    throw new Error('The path is invalid');
  } catch(err) {
    console.error('Operation failed');
  }
}

async function ls(currentPath) {
  try {
    const dirContent = await fsPromises.readdir(currentPath, 
      {"withFileTypes": true});
    const printInfo = []
    for (const content of dirContent) {
      let contentType = 'undefined';
      if (content.isDirectory()) {
        contentType = 'directory';
      } else if (content.isFile()) {
        contentType = 'file';
      } else if (content.isSymbolicLink()) {
        contentType = 'symbolic link';
      }
      const newContent = { name: content.name,
        type: contentType };
      printInfo.push(newContent);
    }
    printInfo.sort((a, b) => a.type.localeCompare(b.type) || a.name - b.name);
    console.table(printInfo);
  } catch {
    console.error('Operation failed');
  }
}

export { up, cd, ls };
