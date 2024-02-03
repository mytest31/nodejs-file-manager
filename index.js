import os from 'os';
import { Transform, pipeline } from 'stream';


let USERNAME = '';
let CURRENT_DIR = {
  dirPath: os.homedir(),
};

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
  transform(chunk, enc, cb) {
    const inputData = chunk.toString().trim();
    if (inputData.includes('.exit')) {
      console.log(`Thank you for using File Manager, ${USERNAME}, goodbye!`);
      process.exit();
    }
    this.push(os.EOL);
    this.push(os.EOL);
    this.push(`You are currently in ${CURRENT_DIR.dirPath}`);
    this.push(os.EOL);
    cb();
  }
})

async function startConsoleInput() {
  process.stdout.write(`You are currently in ${CURRENT_DIR.dirPath}`);
  process.stdout.write(os.EOL);
  
  pipeline(
    process.stdin,
    transformInput,
    process.stdout,
    (err) => {
      console.error(`Operation failed`)
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
