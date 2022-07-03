const path = require("path");
const fs = require("fs");
const solc = require("solc");

const contractPath = path.resolve(
  __dirname.replace("/scripts", ""), // cd ..
  "src",
  "JustFeedback.sol"
);

const source = fs.readFileSync(contractPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "JustFeedback.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "JustFeedback.sol"
].JustFeedback;
