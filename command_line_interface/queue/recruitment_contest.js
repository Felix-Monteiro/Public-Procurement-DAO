const { ethers } = require("hardhat");
const governanceContract = require("../../artifacts/contracts/governance/GovernanceProtocol.sol/GovernanceProtocol.json");
const adminRecruitmentContract = require("../../artifacts/contracts/board_administration/AdministrativeRecruitmentProcess.sol/AdministrativeRecruitmentProcess.json");

const CONTEST_FUNC = process.env.CONTEST_FUNC;
const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.BOARD_MEMBER_1_PK;
const GOVERNANCE_CONTRACT_ADDRESS = process.env.GOVERNANCE_PROTOCOL_CONTRACT_ADDRESS;
const ADMINISTRATIVE_RECRUITMENT_PROCESS_CONTRACT_ADDRESS = process.env.ADMINISTRATIVE_RECRUITMENT_PROCESS_CONTRACT_ADDRESS;
const MIN_DELAY = process.env.MIN_DELAY;

// Provider - Alchemy
const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", API_KEY);
// Signer - Deployer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
// Contracts Instances
const governanceProtocolContract = new ethers.Contract(GOVERNANCE_CONTRACT_ADDRESS, governanceContract.abi, signer);
const administrativeRecruitmentContract = new ethers.Contract(ADMINISTRATIVE_RECRUITMENT_PROCESS_CONTRACT_ADDRESS, adminRecruitmentContract.abi, signer);

async function queueRecruitment() {
    // User's Input data
    const proposalId = "37376586481694209258064149514708176557060303248398171764593058137911803722227";
    const contest_name = "New Orthoprosthesis Public Contest 2";
    const proposal_description = "The Hospital Santa Maria requires a new Service for Orthoprothesis 2";
    
    const functionToCall = CONTEST_FUNC;
    const encodedFunctionCall = administrativeRecruitmentContract.interface.encodeFunctionData(functionToCall, [contest_name])
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(proposal_description));
    console.log("_______________________________________________________________________________________\n");
    console.log("Queueing...")
    const queueTx = await governanceProtocolContract.queue(
        [administrativeRecruitmentContract.address],
        [0],
        [encodedFunctionCall],
        descriptionHash);

    await queueTx.wait();
    console.log(`Thank you for Queueing Proposal: ${proposalId}\n`);
    console.log(`Please wait the required minimum delay: ${MIN_DELAY} before executing.\n`);
};

queueRecruitment()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    });