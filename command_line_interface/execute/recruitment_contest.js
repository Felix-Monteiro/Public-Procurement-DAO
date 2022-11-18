const { ethers } = require("hardhat");
var fs = require('fs');
const governanceContract = require("../../artifacts/contracts/governance/GovernanceProtocol.sol/GovernanceProtocol.json");
const adminRecruitmentContract = require("../../artifacts/contracts/board_administration/AdministrativeRecruitmentProcess.sol/AdministrativeRecruitmentProcess.json");
const question = require("./cli_questions");

const executedProposals = process.env.executedProposals;
const CONTEST_FUNC = process.env.CONTEST_FUNC;
const API_KEY = process.env.API_KEY;
const GOVERNANCE_CONTRACT_ADDRESS = process.env.GOVERNANCE_PROTOCOL_CONTRACT_ADDRESS;
const ADMINISTRATIVE_RECRUITMENT_PROCESS_CONTRACT_ADDRESS = process.env.ADMINISTRATIVE_RECRUITMENT_PROCESS_CONTRACT_ADDRESS;

async function executeRecruitment() {
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
    console.log("Executing...")
    const executeTx = await governanceProtocolContract.execute(
        [administrativeRecruitmentContract.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    )
    await executeTx.wait(1)

    // Save Proposal in JSON files
    let proposalsInfo = JSON.parse(fs.readFileSync(executedProposals, "utf8"));
    proposalsInfo["goerli"].push("ID: " + proposalId.toString(),
        ["Index: " + proposalId.toString(), "Function: " + CONTEST_FUNC.toString(), "Passed"]);
    fs.writeFileSync(executedProposals, JSON.stringify(proposalsInfo, null, 2));

    console.log(`The Public Instituition requires the service: ${await administrativeRecruitmentContract.retrieve()}`)
};

executeRecruitment()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    });