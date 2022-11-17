const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.DEPLOYER_PK;
const ADMIN_CONTRACT = process.env.ADMINISTRATIVE_RECRUITMENT_PROCESS_CONTRACT_ADDRESS;
const TIME_LOCK_CONTRACT = process.env.TIME_LOCK_CONTRACT_ADDRESS;

const { ethers } = require("hardhat");
const administrativeRecruitmentProcess = require("../../artifacts/contracts/board_administration/AdministrativeRecruitmentProcess.sol/AdministrativeRecruitmentProcess.json");
const timeLockContract = require("../../artifacts/contracts/governance/TimeLock.sol/TimeLock.json");

// Provider - Alchemy
const alchemyProvider = new ethers.providers.AlchemyProvider(network = "goerli", API_KEY);
// Signer - Deployer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
//contract instance
const administrativeRecruitmentProcessContract = new ethers.Contract(ADMIN_CONTRACT, administrativeRecruitmentProcess.abi, signer);
const timeLock = new ethers.Contract(TIME_LOCK_CONTRACT, timeLockContract.abi, signer);

async function transferOwnership() {
  console.log(`Transfering Ownership of: ${administrativeRecruitmentProcessContract.address}`);
  const transferTx = await administrativeRecruitmentProcessContract.transferOwnership(timeLock.address);
  await transferTx.wait();
  console.log(`New Owner is: ${await administrativeRecruitmentProcessContract.owner()}`);
};

transferOwnership()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });