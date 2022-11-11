require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-contract-sizer");
require('dotenv').config();


const {API_URL, DEPLOYER_PK, ETHERSCAN_API_KEY} = process.env;

module.exports = {
    solidity: {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      defaultNetwork: "goerli",
      networks:{
        hardhat: {},
        goerli: {
          url: API_URL,
          accounts: [`0x${DEPLOYER_PK}`]
        }
      },
      etherscan: {
        apiKey: ETHERSCAN_API_KEY
      },
      contractSizer: {
        alphaSort: true,
        runOnCompile: false,
        disambiguatePaths: false,
      },
};
