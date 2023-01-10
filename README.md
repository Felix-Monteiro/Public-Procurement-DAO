# Public-Procurement-DAO

This prototype presents a Test Net version of an on-chain governance Decentralised Autonomous Organisation (DAO) used as the bridge between all participating parties of a Public Procurement Contest.
This DApp is deployed using Hardhat and the Goerli Test Net.
This version uses JavaScript and Solidity to deploy and interact with the smart contracts and uses a bash script CLI that automates the user interaction with the system.

## Verified Contracts (EtherScan):
* [TimeLock.sol](https://goerli.etherscan.io/address/0x55D42328e65aDB6E28A4bF92d8fAeB084d985450#code)
* [GovernanceToken.sol](https://goerli.etherscan.io/address/0x4Fc6f6c19F1ff3E7Cd6E14C6Bf4680ecEE3d4875#code)
* [GovernanceProtocol.sol](https://goerli.etherscan.io/address/0x3f0A49E5F2B4271e2777Da02845a1a913b2aFEe3#code)
* [AdministrativeAccessControl.sol](https://goerli.etherscan.io/address/0x8E8b30861A8a35CD9254FF1ccf3d458F4e216271#code)
* [AdministrativeRecruitmentProcess.sol](https://goerli.etherscan.io/address/0xd58d1afb2C0f5B10a3EA4e2781facf5108291553#code)
* [SeniorSupplierProcess.sol](https://goerli.etherscan.io/address/0x8cF6314FFa9667D2B148230be0F229e7a1bac5eE#code)
* [SupplierProcess.sol](https://goerli.etherscan.io/address/0xE8039A79828b029E0e7A7628F79EFD05399b703F#code)

### Frameworks:
* Solidity
* JavaScript
* [Hardhat](https://hardhat.org/)
* [Openzeppelin](https://www.openzeppelin.com/)

### TestNet:
* To communicate with the Goerli Test Net we use [Alchemy](https://www.alchemy.com/), a Node Provider that allows us to communicate with the Ethereum chain without having to run our own nodes.

## Requirements:
* Hardhat
* Alchemy API
* MetaMask Account
* git
* Nodejs 
* Yarn

## Setup:
1. git clone https://github.com/Felix-Monteiro/Public-Recruitment-DAO.git
2. yarn
3. yarn hardhat compile
4. cd command_line_interface
5. bash main_menu.sh

## Execution:

- For Proposals follow order (Execute one iteration of this order at a time):

        1. Propose
        2. Delegate (optional after first delegation)
        3. Vote
        4. Queue
        5. Execute

- It is recommended to Delegate GT tokens to the Voting Account before each vote in order to activate checkpoints and have voting power tracket. Each Delegation provides 1 GT to the Voting Account.
- In the deployed version, the voting period is set for 12 blocks, approximately 3 minutes in the Goerli test net.
