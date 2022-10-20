const API_KEY = process.env.API_URL;
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.GOVERNANCE_TOKEN_CONTRACT_ADDRESS;
const DELEGATED_ACCOUNT = process.env.BOARD_MEMBER_1;

const {ethers} = require("hardhat");
const contract = require("../artifacts/contracts/governance/GovernanceToken.sol/GovernanceToken.json");

// Provider - Alchemy
const alchemyProvider = new ethers.providers.AlchemyProvider(network="goerli", API_KEY);
// Signer - Deployer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
//contract instance
//const governanceTokenContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

const delegatedAccount = DELEGATED_ACCOUNT;

async function delegateGovernanceToken() {
  const governanceTokenContract = await ethers.getContractAt("GovernanceToken",CONTRACT_ADDRESS);
  console.log(`Delegating Governance Tokens to: ${delegatedAccount}`);
  
  const transactionResponse = await governanceTokenContract.delegate(delegatedAccount);
  await transactionResponse.wait();
  console.log(`Delegated!`);
  
  console.log(`Checkpoints: ${await governanceTokenContract.numCheckpoints(delegatedAccount)}`);
  console.log('Governance Tokens Delegated!');
};

delegateGovernanceToken()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
