import path from 'path';

function up(currentPath) {
  return path.dirname(currentPath);
}

function cd() {
  //
}

function ls() {

}

export { up, cd, ls };
