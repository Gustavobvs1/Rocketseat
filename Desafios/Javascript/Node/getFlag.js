const getFlagValue = require("./flag");

const Flag = [getFlagValue("--name"), getFlagValue("--greeting")];

console.log(`${Flag[1]} ${Flag[0]}`);
