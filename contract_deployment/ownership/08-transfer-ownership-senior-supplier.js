const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.DEPLOYER_PK;
const SENIOR_SUPPLIER_CONTRACT = process.env.SENIOR_SUPPLIER_CONTRACT_ADDRESS;
const TIME_LOCK_CONTRACT = process.env.TIME_LOCK_CONTRACT_ADDRESS;

const { ethers } = require("hardhat");
const seniorSupplierProcess = require("../../artifacts/contracts/SeniorSupplierProcess.sol/SeniorSupplierProcess.json");
const timeLockContract = require("../../artifacts/contracts/governance/TimeLock.sol/TimeLock.json");

// Provider - Alchemy
const alchemyProvider = new ethers.providers.AlchemyProvider(network = "goerli", API_KEY);
// Signer - Deployer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
//contract instance
const seniorSupplierProcessContract = new ethers.Contract(SENIOR_SUPPLIER_CONTRACT, seniorSupplierProcess.abi, signer);
const timeLock = new ethers.Contract(TIME_LOCK_CONTRACT, timeLockContract.abi, signer);

async function transferOwnership() {
  console.log(`Transfering Ownership of: ${seniorSupplierProcessContract.address}`);
  const transferTx = await seniorSupplierProcessContract.transferOwnership(timeLock.address);
  await transferTx.wait();
  console.log(`Transfered!`);
  console.log(`New Owner is: ${await seniorSupplierProcessContract.owner()}`);
};

transferOwnership()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });