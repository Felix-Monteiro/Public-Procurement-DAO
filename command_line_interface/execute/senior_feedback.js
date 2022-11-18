const { ethers } = require("hardhat");
const governanceContract = require("../../artifacts/contracts/governance/GovernanceProtocol.sol/GovernanceProtocol.json");
const seniorSupplierContract = require("../../artifacts/contracts/SeniorSupplierProcess.sol/SeniorSupplierProcess.json");
var fs = require('fs');
const question = require("./cli_questions");

const executedProposals = process.env.executedProposals;
const FEEDBACK_FUNC = process.env.FEEDBACK_FUNC;
const API_KEY = process.env.API_KEY;
const GOVERNANCE_CONTRACT_ADDRESS = process.env.GOVERNANCE_PROTOCOL_CONTRACT_ADDRESS;
const SENIOR_SUPPLIER_CONTRACT_ADDRESS = process.env.SENIOR_SUPPLIER_CONTRACT_ADDRESS;

async function executeSeniorFeedback() {
    // User's Input data
    const PRIVATE_KEY = await question.caller_private_key();
    const proposalId = await question.proposal_index_request();
    const feedback_name = await question.feedback_name_request();
    const proposal_description = await question.proposal_description_request();

    // Provider - Alchemy
    const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", API_KEY);
    // Signer
    const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
    // Contracts Instances
    const governanceProtocolContract = new ethers.Contract(GOVERNANCE_CONTRACT_ADDRESS, governanceContract.abi, signer);
    const seniorSupplierProcessContract = new ethers.Contract(SENIOR_SUPPLIER_CONTRACT_ADDRESS, seniorSupplierContract.abi, signer);

    const encodedFunctionCall = seniorSupplierProcessContract.interface.encodeFunctionData(FEEDBACK_FUNC, [feedback_name]);
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(proposal_description));
    console.log("_______________________________________________________________________________________\n");
    console.log("Executing...");
    const executeTx = await governanceProtocolContract.execute(
        [seniorSupplierProcessContract.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    );

    await executeTx.wait();

    // Save Executed Proposal in JSON file
    let proposalsInfo = JSON.parse(fs.readFileSync(executedProposals, "utf8"));
    proposalsInfo["goerli"].push("ID: " + proposalId.toString(),
        ["Index: " + proposalId.toString(), "Function: " + FEEDBACK_FUNC.toString(), "Passed"]);
    fs.writeFileSync(executedProposals, JSON.stringify(proposalsInfo, null, 2));

    console.log(`Thank you for Executing Proposal: ${proposalId}\n`);
};

executeSeniorFeedback()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    });