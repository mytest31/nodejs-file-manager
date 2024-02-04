import os from 'os';
import { Transform, pipeline } from 'stream';
import { getOSInfo } from './custom_modules/basic-os/basic-os.js';
import {up, cd, ls} from './custom_modules/nwd/nwd.js';
import { getHash } from './custom_modules/hash/hash.js';
import { compress, decompress } from './custom_modules/zip/zip.js';

import { cat, add, rn, cp, mv, rm }
  from './custom_modules/basic-fs/basic-fx.js';


let USERNAME = '';
let CURRENT_DIR = os.homedir();


async function checkInitialParameters() {
  const argv = process.argv.at(-1);
  if (!argv.includes('=') || argv.split('=').length !== 2) {
    console.log('Invalid input.'
      + ' Please, to start the application, enter the following command'
      + ' "npm run start -- --username=your_username"');
    process.exit();
  }
}

async function printWelcomeMessage() {
  USERNAME = process.argv.at(-1).split('=')[1].trim();
  process.stdout.write(`Welcome to the File Manager, ${USERNAME}!`);
  process.stdout.write(os.EOL + os.EOL);
}

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
      console.error('The File Management system failed');
    }
    cb();
  }
})

async function startConsoleInput() {
  process.stdout.write(`You are currently in ${CURRENT_DIR}`);
  process.stdout.write(os.EOL);
  
  pipeline(
    process.stdin,
    transformInput,
    process.stdout,
    (err) => {
      if (err) {
        console.log(err);
        console.error(`The program failed.`);
      }
    }
  )

  process.on("SIGINT", (code) => {
    console.log(`Thank you for using File Manager, ${USERNAME}, goodbye!`);
    process.exit();
  })
}

async function startApp() {
  await checkInitialParameters();
  await printWelcomeMessage();
  await startConsoleInput();
}

startApp();
