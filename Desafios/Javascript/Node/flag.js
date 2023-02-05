function getFlag(string) {
  let index = process.argv.indexOf(string) + 1;
  return process.argv[index];
}

module.exports = getFlag;
