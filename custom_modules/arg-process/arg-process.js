function getArguments(args) {
  const argsString = args.join(' ').trim();
  let argsArr = [];
  if (!argsString.includes('"') && !argsString.includes("'")) {
    argsArr = argsString.split(" ");
  } else if ((argsString.includes('"') && (argsString.split('"').length - 1) % 2 !== 0) 
    || (argsString.includes("'") && (argsString.split("'").length - 1) % 2 !== 0)) {
    throw new Error("Input arguments invalid");
  } else {
    let quotationSymbol = argsString.includes('"') ? '"' : "'";
    const argsToProcess = argsString.split(quotationSymbol);
    argsToProcess.map((elem) => elem.trim() !== '' ? argsArr.push(elem.trim()) : null);
  }

  return argsArr;
}

export { getArguments };