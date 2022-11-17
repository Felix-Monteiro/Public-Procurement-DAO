const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.DEPLOYER_PK;
const ADMIN_CONTRACT = process.env.ADMINISTRATIVE_ACCESS_CONTROL_ADDRESS;
const TIME_LOCK_CONTRACT = process.env.TIME_LOCK_CONTRACT_ADDRESS;

const { ethers } = require("hardhat");
const adminAccessControlcontract = require("../../artifacts/contracts/board_administration/AdministrativeAccessControl.sol/AdministrativeAccessControl.json");
const timeLockContract = require("../../artifacts/contracts/governance/TimeLock.sol/TimeLock.json");

// Provider - Alchemy
const alchemyProvider = new ethers.providers.AlchemyProvider(network = "goerli", API_KEY);
// Signer - Deployer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
//contract instance
const administrativeAccessControlContract = new ethers.Contract(ADMIN_CONTRACT, adminAccessControlcontract.abi, signer);
const timeLock = new ethers.Contract(TIME_LOCK_CONTRACT, timeLockContract.abi, signer);

async function transferOwnership() {
    console.log(`Transfering Ownership of: ${administrativeAccessControlContract.address}`);
    const transferTx = await administrativeAccessControlContract.transferOwnership(timeLock.address);
    await transferTx.wait();
    console.log(`New Owner is: ${timeLock.address}`);
};

transferOwnership()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });