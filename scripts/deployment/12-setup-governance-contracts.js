const { ethers } = require("hardhat");

const ADDRESS_ZERO = process.env.ADDRESS_ZERO;
const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.DEPLOYER_PK;
const GOVERNOR_CONTRACT = process.env.GOVERNANCE_PROTOCOL_CONTRACT_ADDRESS;
const TIME_LOCK_CONTRACT = process.env.TIME_LOCK_CONTRACT_ADDRESS;

const governanceProtocolContract = require("../../artifacts/contracts/governance/GovernanceProtocol.sol/GovernanceProtocol.json");
const timeLockContract = require("../../artifacts/contracts/governance/TimeLock.sol/TimeLock.json");

// Provider - Alchemy
const alchemyProvider = new ethers.providers.AlchemyProvider(network = "goerli", API_KEY);
// Signer - Deployer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
//contract instance
const governor = new ethers.Contract(GOVERNOR_CONTRACT, governanceProtocolContract.abi, signer);
const timeLock = new ethers.Contract(TIME_LOCK_CONTRACT, timeLockContract.abi, signer);

async function setupContracts() {
    const [deployer] = await ethers.getSigners();

    console.log("\n----------------------------------------------------");
    console.log("Setting up contracts for roles...");

    const proposerRole = await timeLock.PROPOSER_ROLE();
    const executorRole = await timeLock.EXECUTOR_ROLE();
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();
    
    console.log("Roles set...");
    console.log("Giving Proposal Role to the DAO...");

    // Giving Proposal Role to the DAO - only GovernanceProtocol can schedule and cancel operations
    const proposerTx = await timeLock.grantRole(proposerRole, governor.address);
    await proposerTx.wait();

    console.log("Giving Executor Role to everyone...");
    // Giving Executor Role to everyone - everyone can execute the operations scheduled by the proposer
    const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO);
    await executorTx.wait();

    console.log("Revoking the initial admin role from deployer...");
    // Decentralisation - Revoking the initial admin role from deployer (only TimeLock is Admin)
    const revokeTx = await timeLock.revokeRole(adminRole, deployer.address);
    await revokeTx.wait();

    console.log("\nPublic Recruitment DAO deployed!");
};

setupContracts()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });