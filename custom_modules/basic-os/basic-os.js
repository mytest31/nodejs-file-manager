import os from 'os';

async function getEOL(thisObj) {
  thisObj.push(JSON.stringify(os.EOL));
}

async function getCPUS() {
  const cpuInfo = [];
  for (const cpu of os.cpus()) {
    cpuInfo.push({ model: cpu.model, ["speed (GHz)"]: cpu.speed / 1000 });
  }
  console.table(cpuInfo);
}

async function getHomeDir(thisObj) {
  thisObj.push(os.homedir());
}

async function getUsername(thisObj) {
  thisObj.push(os.userInfo().username);
}

async function getArchitecture(thisObj) {
  thisObj.push(os.arch());
}

async function getOSInfo(thisObj, args) {
  if (args.length !== 1 || args[0].trim() === "") {
    throw new Error("Wrong number of arguments");
  }
  
  try {
    let osArg = args[0];
    switch (osArg)  {
      case '--EOL':
        getEOL(thisObj);
        break;
      case '--cpus':
        getCPUS();
        break;
      case '--homedir':
        getHomeDir(thisObj);
        break;
      case '--username':
        getUsername(thisObj);
        break;
      case '--architecture':
        getArchitecture(thisObj);
        break;
      default:
        console.error('Invalid input');    
    }
  } catch {
    console.error('Operation failed');
  }
  
}

export { getOSInfo };
