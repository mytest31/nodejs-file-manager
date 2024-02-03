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

function ls() {

}

export { up, cd, ls };
