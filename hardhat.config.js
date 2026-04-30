require("@nomicfoundation/hardhat-ethers");

// Load .env.local manually
const fs = require("fs");
const envFile = fs.readFileSync(".env.local", "utf8");
envFile.split("\n").forEach(line => {
  const [key, ...vals] = line.split("=");
  if (key && !key.startsWith("#") && vals.length) {
    process.env[key.trim()] = vals.join("=").trim().replace(/^"|"$/g, "");
  }
});

/** @type {import('hardhat/config').HardhatUserConfig} */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    arbitrumSepolia: {
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      chainId: 421614,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
  },
};
