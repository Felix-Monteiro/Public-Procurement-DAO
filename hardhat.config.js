require("@nomiclabs/hardhat-waffle");
require("hardhat-contract-sizer");
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const {API_URL, DEPLOYER_PK} = process.env;

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
      contractSizer: {
        alphaSort: true,
        runOnCompile: false,
        disambiguatePaths: false,
      },
};
