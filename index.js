import os from 'os';
import { Transform, pipeline } from 'stream';
import {up, cd, ls} from './custom_modules/nwd/nwd.js'

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

const transformInput = new Transform({
  async transform(chunk, enc, cb) {
    try {
      const inputData = chunk.toString().trim();
      if (inputData.includes('.exit')) {
        console.log(`Thank you for using File Manager, ${USERNAME}, goodbye!`);
        process.exit();
      }
      const [command, ...args] =
        inputData
          .split(" ", 2)
          .map((value, idx) => idx === 0 ? value.trim() : value);

      switch (command) {
        case 'up':
          CURRENT_DIR = up(CURRENT_DIR);
          break;
        case 'cd':
          CURRENT_DIR = await cd(CURRENT_DIR, args.join(' ')) ?? CURRENT_DIR;
          break;
        case 'ls':
          console.log(`input ls ${CURRENT_DIR}`);
          await ls(CURRENT_DIR);
          break;
        default:
          console.error('Invalid input');
      }

      this.push(os.EOL + os.EOL);
      this.push(`You are currently in ${CURRENT_DIR}`);
      this.push(os.EOL);
    } catch(err) {
      console.log(err);
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
      console.error(`The programme failed.`)
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
