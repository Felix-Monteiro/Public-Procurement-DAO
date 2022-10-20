/** @type import('hardhat/config').HardhatUserConfig */
require('dotenv').config();
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-ethers");

const {API_URL, DEPLOYER_PRIVATE_KEY} = process.env;

module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "goerli",
  networks:{
    hardhat: {},
    goerli: {
      url: API_URL,
      accounts: [`0x${DEPLOYER_PRIVATE_KEY}`]
    }
  }
};
