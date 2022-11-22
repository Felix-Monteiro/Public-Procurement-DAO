# Public-Recruitment-DAO-Test-Net

This prototype presents a Test Net version of an on-chain governance Decentralised Autonomous Organisation (DAO) used as the bridge between all participating parties of a Public Recruitment Contest.
This DApp is deployed using Hardhat and the Goerli Test Net.
This version uses JavaScript and Solidity to deploy and interact with the smart contracts and uses a bash script CLI that automates the user interaction with the system.

### Frameworks:
* Solidity
* JavaScript
* [Hardhat](https://hardhat.org/)
* [Openzeppelin](https://www.openzeppelin.com/)

### TestNet:
* To communicate with the Goerli Test Net we use [Alchemy](https://www.alchemy.com/), an API that allows us to communicate with the Ethereum chain without having to run our own nodes.

## Requirements:
* Hardhat
* Alchemy API
* MetaMask Account
* git
* Nodejs 
* Yarn

## Setup:
1. git clone NEEDS PROJECT LINK
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
