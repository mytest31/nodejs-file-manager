import os from 'os';
import { Transform } from 'stream';
import { getOSInfo } from '../basic-os/basic-os.js';
import { up, cd, ls } from '../nwd/nwd.js';
import { getHash } from '../hash/hash.js';
import { compress, decompress } from '../zip/zip.js';
import { cat, add, rn, cp, mv, rm }
  from '../basic-fs/basic-fx.js';

let CURRENT_DIR = os.homedir();

function printIntroductionPrompt(thisObj, currentDir) {
  thisObj.push(os.EOL + os.EOL);
  thisObj.push(`You are currently in ${currentDir}`);
  thisObj.push(os.EOL);
}

function getArguments(args) {
  return args;
}

const transformInput = new Transform({
  async transform(chunk, enc, cb) {
    try {
      const inputData = chunk.toString().trim();
      if (inputData.includes('.exit')) {
        console.log(`Thank you for using File Manager, ${USERNAME}, goodbye!`);
        process.exit();
      }
      const [command, ...args] = inputData.split(" ");

      switch (command) {
        case 'up':
          CURRENT_DIR = up(CURRENT_DIR);
          printIntroductionPrompt(this, CURRENT_DIR);
          break;
        case 'cd':
          CURRENT_DIR = await cd(CURRENT_DIR, args.join(' ')) ?? CURRENT_DIR;
          printIntroductionPrompt(this, CURRENT_DIR);
          break;
        case 'ls':
          await ls(CURRENT_DIR);
          printIntroductionPrompt(this, CURRENT_DIR);
          break;
        case 'cat':
          cat(this, CURRENT_DIR, args.join(' '));
          break;
        case 'add':
          await add(CURRENT_DIR, args.join(' '));
          printIntroductionPrompt(this, CURRENT_DIR);
          break;
        case 'rn':
          await rn(CURRENT_DIR, getArguments(args));
          printIntroductionPrompt(this, CURRENT_DIR);
          break;
        case 'cp':
          await cp(this, CURRENT_DIR, args);
          break;
        case 'mv':
          await mv(this, CURRENT_DIR, args);
          break;
        case 'rm':
          await rm(CURRENT_DIR, args.join(' '));
          printIntroductionPrompt(this, CURRENT_DIR);
          break;
        case 'os':
          await getOSInfo(this, args);
          printIntroductionPrompt(this, CURRENT_DIR);
          break;
        case 'hash':
          await getHash(this, CURRENT_DIR, args.join(' '));
          break;
        case 'compress':
          await compress(this, CURRENT_DIR, args);
          break;
        case 'decompress':
          await decompress(this, CURRENT_DIR, args);
          break;
        default:
          console.error('Invalid input');
          printIntroductionPrompt(this, CURRENT_DIR);
      }
    } catch {
      console.error('Invalid input');
    }
    cb();
  }
})

export { transformInput };