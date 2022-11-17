const { ethers } = require("hardhat");
const GOVERNANCE_TOKEN = process.env.GOVERNANCE_TOKEN_CONTRACT_ADDRESS;
const TIME_LOCK = process.env.TIME_LOCK_CONTRACT_ADDRESS;
const QUORUM_PERCENTAGE = process.env.QUORUM_PERCENTAGE;
const VOTING_PERIOD = process.env.VOTING_PERIOD;
const VOTING_DELAY = process.env.VOTING_DELAY;

async function deployGovernanceProtocol() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contract with the account: ", deployer.address);
    console.log("Account balance: ", (await deployer.getBalance()).toString());

    const GovernanceProtocol = await ethers.getContractFactory("GovernanceProtocol");
    const governanceProtocol = await GovernanceProtocol.deploy(GOVERNANCE_TOKEN, TIME_LOCK, QUORUM_PERCENTAGE, VOTING_PERIOD, VOTING_DELAY);

    console.log("Governance Protocol address: ", governanceProtocol.address);
};

deployGovernanceProtocol()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });