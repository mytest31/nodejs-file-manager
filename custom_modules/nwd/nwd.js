import fsPromises from 'fs/promises';
import path from 'path';

function up(currentPath) {
  return path.dirname(currentPath);
}

async function cd(currentPath, pathToDirectory) {
  try {
    let resultPath = '';
    if (path.isAbsolute(pathToDirectory)) {
      resultPath = path.format(path.parse(pathToDirectory));
    } else {
      resultPath = path.resolve(currentPath, pathToDirectory);
    }
    await fsPromises.access(resultPath);
    return resultPath;
  } catch {
    console.error('Invalid input');
  }
}

async function ls(currentPath) {
  try {
    console.log(currentPath);
    const dirContent = await fsPromises.readdir(currentPath, 
      {"withFileTypes": true});
      console.log("after");
    const printInfo = []
    for (const content of dirContent) {
      const newContent = { name: content.name,
        type: content.isDirectory() ? 'directory' : 'file' };
      printInfo.push(newContent);
    }
    printInfo.sort((a, b) => a.type.localeCompare(b.type) || a.name - b.name);
    console.table(printInfo);
  } catch {
    console.error('Invalid input 3');
  }
}

export { up, cd, ls };
