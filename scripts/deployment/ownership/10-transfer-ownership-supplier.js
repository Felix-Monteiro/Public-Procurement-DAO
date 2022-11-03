const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.DEPLOYER_PK;
const SUPPLIER_CONTRACT = process.env.SUPPLIER_CONTRACT_ADDRESS;
const TIME_LOCK_CONTRACT = process.env.TIME_LOCK_CONTRACT_ADDRESS;

const { ethers } = require("hardhat");
const supplierProcess = require("../../../artifacts/contracts/SupplierProcess.sol/SupplierProcess.json");
const timeLockContract = require("../../../artifacts/contracts/governance/TimeLock.sol/TimeLock.json");

// Provider - Alchemy
const alchemyProvider = new ethers.providers.AlchemyProvider(network = "goerli", API_KEY);
// Signer - Deployer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
//contract instance
const supplierProcessContract = new ethers.Contract(SUPPLIER_CONTRACT, supplierProcess.abi, signer);
const timeLock = new ethers.Contract(TIME_LOCK_CONTRACT, timeLockContract.abi, signer);

async function transferOwnership() {
    console.log(`Transfering Ownership of: ${supplierProcessContract.address}`);
    const transferTx = await supplierProcessContract.transferOwnership(timeLock.address);
    await transferTx.wait();
    console.log(`Transfered!`);
    console.log(`New Owner is: ${await supplierProcessContract.owner()}`);
};

transferOwnership()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });