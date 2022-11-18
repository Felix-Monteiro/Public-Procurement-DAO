const { ethers } = require("hardhat");
const governanceContract = require("../../artifacts/contracts/governance/GovernanceProtocol.sol/GovernanceProtocol.json");
const adminRecruitmentContract = require("../../artifacts/contracts/board_administration/AdministrativeRecruitmentProcess.sol/AdministrativeRecruitmentProcess.json");
const question = require("./cli_questions");

const CONTEST_FUNC = process.env.CONTEST_FUNC;
const API_KEY = process.env.API_KEY;
const GOVERNANCE_CONTRACT_ADDRESS = process.env.GOVERNANCE_PROTOCOL_CONTRACT_ADDRESS;
const ADMINISTRATIVE_RECRUITMENT_PROCESS_CONTRACT_ADDRESS = process.env.ADMINISTRATIVE_RECRUITMENT_PROCESS_CONTRACT_ADDRESS;
const MIN_DELAY = process.env.MIN_DELAY;

async function queueRecruitment() {
    // User's Input data
    const PRIVATE_KEY = await question.caller_private_key();
    const proposalId = await question.proposal_index_request();
    const contest_name = await question.contest_name_request();
    const proposal_description = await question.proposal_description_request();

    // Provider - Alchemy
    const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", API_KEY);
    // Signer
    const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
    // Contracts Instances
    const governanceProtocolContract = new ethers.Contract(GOVERNANCE_CONTRACT_ADDRESS, governanceContract.abi, signer);
    const administrativeRecruitmentContract = new ethers.Contract(ADMINISTRATIVE_RECRUITMENT_PROCESS_CONTRACT_ADDRESS, adminRecruitmentContract.abi, signer);

    const encodedFunctionCall = administrativeRecruitmentContract.interface.encodeFunctionData(CONTEST_FUNC, [contest_name])
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