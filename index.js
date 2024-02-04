import os from 'os';
import { pipeline } from 'stream';
import { transformInput }
  from './custom_modules/streams/transform-stream.js';
import { checkInitialParameters, printWelcomeMessage }
  from './custom_modules/initial/initial.js';

let USERNAME = '';

async function startConsoleInput() {
  let startDirPath = os.homedir();
  process.stdout.write(`You are currently in ${startDirPath}`);
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
  USERNAME = await printWelcomeMessage();
  await startConsoleInput();
}

startApp();
