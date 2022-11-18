const { ethers } = require("hardhat");
const question = require("./cli_questions");
const contract = require("../../artifacts/contracts/governance/GovernanceToken.sol/GovernanceToken.json");

const API_KEY = process.env.API_KEY;
const CONTRACT_ADDRESS = process.env.GOVERNANCE_TOKEN_CONTRACT_ADDRESS;


async function delegateGovernanceToken() {
  // User's Input data
  const caller_address = await question.caller_address_request();
  const PRIVATE_KEY = await question.caller_private_key();

  // Provider - Alchemy
  const alchemyProvider = new ethers.providers.AlchemyProvider(network = "goerli", API_KEY);
  // Signer
  const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
  //contract instance
  const governanceTokenContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

  console.log(`\nDelegating Governance Tokens to: ${caller_address}`);

  const transactionResponse = await governanceTokenContract._mintToken();
  await transactionResponse.wait();
  console.log(`Delegated!`);

  console.log(`Checkpoints: ${await governanceTokenContract.numCheckpoints(caller_address)}`);
  console.log('Governance Tokens Delegated!');
};

delegateGovernanceToken()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
