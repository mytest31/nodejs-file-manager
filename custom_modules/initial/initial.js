import os from 'os';

async function checkInitialParameters() {
  const argv = process.argv.at(-1);
  if (!argv.includes('=') || argv.split('=').length !== 2) {
    console.log('Invalid input.'
      + ' Please, to start the application, enter the following command'
      + ' "npm run start -- --username=your_username"');
    process.exit();
  }
}

async function printWelcomeMessage(username) {
  username = process.argv.at(-1).split('=')[1].trim();
  process.stdout.write(`Welcome to the File Manager, ${username}!`);
  process.stdout.write(os.EOL + os.EOL);
  return username;
}


export { checkInitialParameters, printWelcomeMessage };